const inventoryService = require("./inventoryService");
const ordersModel = require("../models/orders.model");
const medicinesModel = require("../models/medicines.model");

const orderService = {
  /**
   * Create Order — auto-selects best batch from inventory
   * No batch_id needed from frontend
   */
  createOrder: async ({ customer_id, pharmacy_id, prescription_id, items }) => {
    let totalAmount = 0;
    const processedItems = [];

    try {
      for (const item of items) {
        // Auto-pick best batch for this medicine
        const batch = await inventoryService.getBestBatch(
          item.medicine_id,
          pharmacy_id,
        );

        if (!batch) {
          console.warn(
            `[OrderService] No stock for medicine ${item.medicine_id} — skipping item.`,
          );
          continue; // Skip out-of-stock items
        }

        // Deduct from the auto-selected batch
        await inventoryService.sellFromBatch(batch.id, item.quantity);

        const unitPrice = parseFloat(batch.price || item.price || 0);
        totalAmount += unitPrice * parseInt(item.quantity);
        processedItems.push({ ...item, batch_id: batch.id, price: unitPrice });
      }

      if (processedItems.length === 0) {
        throw new Error(
          "No items could be added to the order — all medicines are out of stock.",
        );
      }

      // Create Order Record
      // Fetch pharmacy's default delivery agent if not provided
      let delivery_agent_id = null;
      const pharmacy = await require("../models/pharmacies.model").getById(
        pharmacy_id,
      );
      if (pharmacy) {
        delivery_agent_id = pharmacy.default_delivery_agent_id;
      }
      console.log(
        `[OrderService] Assigning agent ${delivery_agent_id} for pharmacy ${pharmacy_id}`,
      );

      const orderResult = await ordersModel.create({
        customer_id,
        pharmacy_id,
        prescription_id,
        total_amount: totalAmount,
        payment_mode: "CASH",
        delivery_address: "Direct Delivery", // Or fetch from customer
        delivery_agent_id: delivery_agent_id,
      });

      const orderId = orderResult.insertId;

      // Insert Line Items
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
        message: "Order created successfully.",
      };
    } catch (error) {
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

  /**
   * Reject Order (Pharmacy cancels)
   * Restocks inventory and updates status to CANCELLED
   */
  rejectOrder: async (orderId) => {
    // 1. Get Order Details to find items to restock
    const order = await ordersModel.getOrderDetails(orderId);
    if (!order) throw new Error("Order not found");

    if (
      order.order_status === "CANCELLED" ||
      order.order_status === "DELIVERED"
    ) {
      throw new Error("Order cannot be rejected in its current state");
    }

    // 2. Restock Items — find the best batch for each medicine and return stock
    for (const item of order.items) {
      // Find the best available batch for this medicine and add stock back
      const batches = await inventoryService.getBatches(
        item.medicine_id,
        order.pharmacy_id,
      );
      if (batches && batches.length > 0) {
        // Pick the furthest-expiry batch to stay safe
        const targetBatch = batches[batches.length - 1];
        await inventoryService.restockBatch(targetBatch.id, item.quantity);
      } else {
        console.warn(
          `Could not restock medicine ${item.medicine_id} — no active batches found.`,
        );
      }
    }

    // 3. Update Status
    await ordersModel.updateStatus(orderId, "CANCELLED");
    // Only flag REFUND_DUE if customer had already paid (e.g. online payment)
    // COD orders that were never paid don't need a refund
    const newPaymentStatus =
      order.payment_status === "PAID" ? "REFUND_DUE" : "VOID";
    await ordersModel.updatePaymentStatus(orderId, newPaymentStatus);

    return {
      success: true,
      message: "Order rejected and inventory restocked.",
    };
  },
};

module.exports = orderService;
