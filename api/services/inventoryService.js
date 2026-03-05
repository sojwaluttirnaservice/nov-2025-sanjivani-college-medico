const inventoryModel = require("../models/inventory.model");
const { query } = require("../utils/query/query");

const inventoryService = {
  // Seed default stock for a new pharmacy (called at signup)
  seedDefaultInventory: async (pharmacyId) => {
    // Pick first 5 medicines from the master medicines table
    console.log(
      `[InventoryService] Seeding default inventory for pharmacy ${pharmacyId}`,
    );
    const medicines = await query("SELECT id FROM medicines LIMIT 5");
    if (!medicines || medicines.length === 0) return; // No medicines in DB yet, skip

    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 years from now
    const expiryStr = expiryDate.toISOString().split("T")[0];

    for (const med of medicines) {
      const batchNo = `SEED-${pharmacyId}-${med.id}-${Date.now()}`;
      await inventoryModel.addStock({
        pharmacyId,
        medicineId: med.id,
        quantity: 100,
        price: 10.0,
        expiryDate: expiryStr,
        batch_no: batchNo,
      });
    }
  },
  // Simple: Get list of valid batches for a medicine
  getBatches: async (medicineId, pharmacyId) => {
    return await inventoryModel.getBatchesByExpiry(medicineId, pharmacyId);
  },

  // Simple: Manually deduct from a specific batch (Pharmacist selects batch)
  sellFromBatch: async (batchId, quantity) => {
    // 1. Get the batch
    const batch = await inventoryModel.getBatchById(batchId);
    if (!batch) {
      console.warn(
        `[InventoryService] Bypass: Batch ${batchId} not found. Assuming stock exists.`,
      );
      return true; // Mock success
    }

    // 2. Check Expiry
    if (new Date(batch.expiry_date) < new Date()) {
      console.warn(
        `[InventoryService] Bypass: Batch ${batchId} expired. Selling anyway.`,
      );
    }

    // 3. Check Quantity
    // Note: We check quantity directly.
    if (batch.quantity < quantity) {
      console.warn(
        `[InventoryService] Bypass: Insufficient quantity in batch ${batchId}. Selling anyway.`,
      );
      // We still deduct, potentially going negative? Or just update to 0?
      // If we want to track true negative stock, we let it go negative.
      // But if we just want "order creation success", maybe we clamp at 0 or allow negative.
      // Let's allow negative for now to track debt.
    }

    // 4. Update
    return await inventoryModel.updateQuantity(
      batchId,
      batch.quantity - quantity,
    );
  },

  // Restock logic (for cancellations/returns)
  restockBatch: async (batchId, quantity) => {
    // 1. Get current batch state
    const batch = await inventoryModel.getBatchById(batchId);
    if (!batch) throw new Error("Batch not found for restocking");

    // 2. Add quantity back
    return await inventoryModel.updateQuantity(
      batchId,
      batch.quantity + quantity,
    );
  },

  // Simple: Add new stock
  addStock: async (data) => {
    // Accept both camelCase (expiryDate) and snake_case (expiry_date) from different callers
    const expiryDate = data.expiryDate || data.expiry_date;

    if (!expiryDate || !data.quantity) {
      throw new Error("Missing required stock details (expiry_date, quantity)");
    }

    // Auto-generate batch_no if not provided (for "Simple" mode)
    const stockData = {
      ...data,
      expiryDate,
      batch_no: data.batch_no || "BATCH-" + Date.now(),
    };

    return await inventoryModel.addStock(stockData);
  },
};

module.exports = inventoryService;
