const inventoryService = require("./inventoryService");
const ordersModel = require("../models/orders.model");

const orderService = {
  /**
   * Create Order with Inventory Deduction (Atomic-ish)
   * Handles COD Payment Mode logic
   */
  createOrder: async ({ customer_id, pharmacy_id, prescription_id, items }) => {
    // items = [{ batch_id, medicine_id, quantity, price }]

    let totalAmount = 0;
    const processedItems = [];

    try {
      // 1. Validate & Deduct Inventory First (Pessimistic Locking strategy simulated)
      for (const item of items) {
        // This throws error if stock is insufficient
        await inventoryService.sellFromBatch(item.batch_id, item.quantity);

        totalAmount += parseFloat(item.price) * parseInt(item.quantity);
        processedItems.push(item);
      }

      // 2. Create Order Record
      const orderResult = await ordersModel.create({
        customer_id,
        pharmacy_id,
        prescription_id,
        total_amount: totalAmount,
        payment_mode: "CASH", // Hardcoded as per requirement
      });

      const orderId = orderResult.insertId;

      // 3. Insert Line Items
      for (const item of processedItems) {
        await ordersModel.addOrderItem({
          order_id: orderId,
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          price: item.price,
        });
      }

      return {
        success: true,
        orderId,
        totalAmount,
        message:
          "Order created successfully with PROVISIONAL Inventory deduction.",
      };
    } catch (error) {
      // ERROR HANDLING: If inventory deducts but order fails, we should ideally rollback.
      // For MVP, we assume consistency. Real app needs Transactions.
      console.error("Order Creation Failed:", error);
      throw error;
    }
  },

  /**
   * Mark Order as Delivered & Collect Cash
   * Updates Revenue indirectly (via delivered status)
   */
  markDelivered: async (orderId) => {
    // 1. Update Order Status
    await ordersModel.updateStatus(orderId, "DELIVERED");

    // 2. Mark Payment as PAID (Cash Received)
    await ordersModel.updatePaymentStatus(orderId, "PAID");

    return {
      success: true,
      message: "Order Delivered and Cash Payment Recorded.",
    };
  },
};

module.exports = orderService;
