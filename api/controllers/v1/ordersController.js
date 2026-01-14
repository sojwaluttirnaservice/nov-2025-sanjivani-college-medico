const ordersModel = require("../../models/orders.model");

const ordersController = {
  getOrders: async (req, res) => {
    try {
      const pharmacyId = req.query.pharmacyId || 1;
      const orders = await ordersModel.getOrdersByPharmacyId(pharmacyId);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await ordersModel.getOrderDetails(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await ordersModel.updateStatus(id, status);
      res.status(200).json({ message: "Order status updated" });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = ordersController;
