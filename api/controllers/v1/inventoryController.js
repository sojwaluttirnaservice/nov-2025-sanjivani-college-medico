const inventoryModel = require("../../models/inventory.model");
const inventoryService = require("../../services/inventoryService");

const inventoryController = {
  getInventory: async (req, res) => {
    try {
      const pharmacyId = req.query.pharmacyId || 1;
      const inventory =
        await inventoryModel.getInventoryByPharmacyId(pharmacyId);
      res.status(200).json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addStock: async (req, res) => {
    try {
      // Expect batch_no, expiryDate, etc.
      const data = { ...req.body, pharmacyId: req.body.pharmacyId || 1 };

      await inventoryService.addStock(data);

      res.status(201).json({ message: "Stock batch added successfully" });
    } catch (error) {
      console.error("Error adding stock:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Simple: Get batches for a specific medicine (So student can see "Batch A, Batch B")
  getMedicineBatches: async (req, res) => {
    try {
      const { medicineId } = req.query; // Changed from params to query to match previous pattern or keep it simple
      const pharmacyId = req.query.pharmacyId || 1;

      if (!medicineId)
        return res.status(400).json({ message: "Medicine ID required" });

      const batches = await inventoryService.getBatches(medicineId, pharmacyId);
      res.status(200).json(batches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching batches" });
    }
  },

  // Simple: Sell item (Deduct stock) - New Endpoint
  sellItem: async (req, res) => {
    try {
      const { batchId, quantity } = req.body;
      if (!batchId || !quantity)
        return res
          .status(400)
          .json({ message: "Batch ID and Quantity required" });

      await inventoryService.sellFromBatch(batchId, quantity);
      res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getLowStockAlerts: async (req, res) => {
    try {
      const pharmacyId = req.query.pharmacyId || 1;
      const threshold = req.query.threshold || 30; // Default threshold

      const alerts = await inventoryModel.getLowStock(pharmacyId, threshold);
      res.status(200).json(alerts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching alerts", error: error.message });
    }
  },
};

module.exports = inventoryController;
