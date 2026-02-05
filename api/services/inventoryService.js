const inventoryModel = require("../models/inventory.model");

const inventoryService = {
  // Simple: Get list of valid batches for a medicine
  getBatches: async (medicineId, pharmacyId) => {
    return await inventoryModel.getBatchesByExpiry(medicineId, pharmacyId);
  },

  // Simple: Manually deduct from a specific batch (Pharmacist selects batch)
  sellFromBatch: async (batchId, quantity) => {
    // 1. Get the batch
    const batch = await inventoryModel.getBatchById(batchId);
    if (!batch) throw new Error("Batch not found");

    // 2. Check Expiry
    if (new Date(batch.expiry_date) < new Date()) {
      throw new Error("Cannot sell expired medicine");
    }

    // 3. Check Quantity
    // Note: We check physical_quantity directly. Reserved logic is skipped for simplicity.
    if (batch.physical_quantity < quantity) {
      throw new Error("Insufficient quantity in this batch");
    }

    // 4. Update
    return await inventoryModel.updateQuantity(
      batchId,
      batch.physical_quantity - quantity,
    );
  },

  // Simple: Add new stock
  addStock: async (data) => {
    // Validate data
    if (!data.batch_no || !data.expiry_date || !data.quantity) {
      throw new Error(
        "Missing required stock details (batch_no, expiry_date, quantity)",
      );
    }
    return await inventoryModel.addStock(data);
  },
};

module.exports = inventoryService;
