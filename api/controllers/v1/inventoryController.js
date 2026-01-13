const inventoryModel = require("../../models/inventory.model");

const inventoryController = {
  getInventory: async (req, res) => {
    try {
      // Assuming user.pharmacyId is available or we look it up from user.id
      // For now, let's assume we pass pharmacyId or derive it.
      // Since users table doesn't have pharmacy_id, we might need to query relations.
      // Simplified: req.user.id -> join pharmacy users?
      // For this MVP, let's assume a fixed pharmacy for the logged in user or pass query param

      // Temporary: Get pharmacy ID from query or default to 1 for MVP testing
      const pharmacyId = req.query.pharmacyId || 1;

      const inventory = await inventoryModel.getInventoryByPharmacyId(
        pharmacyId
      );
      res.status(200).json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addStock: async (req, res) => {
    try {
      const data = { ...req.body, pharmacyId: req.body.pharmacyId || 1 };
      await inventoryModel.addStock(data);
      res.status(201).json({ message: "Stock added successfully" });
    } catch (error) {
      console.error("Error adding stock:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = inventoryController;
