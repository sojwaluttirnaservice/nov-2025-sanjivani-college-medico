const deliveriesModel = require("../../models/deliveries.model");

const deliveryController = {
  getActiveDeliveries: async (req, res) => {
    try {
      const tasks = await deliveriesModel.getActiveDeliveries();
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getHistory: async (req, res) => {
    try {
      // req.user.id would be the agent ID
      const history = await deliveriesModel.getHistory(req.user?.id);
      res.status(200).json(history);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = deliveryController;
