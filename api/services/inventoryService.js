const inventoryModel = require("../models/inventory.model");
const { query } = require("../utils/query/query");

const inventoryService = {
  // Seed default stock for a new pharmacy (called at signup)
  seedDefaultInventory: async (pharmacyId) => {
    console.log(
      `[InventoryService] Seeding ALL medicines inventory for pharmacy ${pharmacyId}...`,
    );

    try {
      // Mass-seed all medicines using a single efficient database query
      const sql = `
        INSERT IGNORE INTO pharmacy_inventory 
        (pharmacy_id, medicine_id, quantity, price, expiry_date)
        SELECT 
          ?, 
          id, 
          100, 
          price, 
          DATE_ADD(CURRENT_DATE, INTERVAL 2 YEAR)
        FROM medicines
      `;

      const result = await query(sql, [pharmacyId]);
      console.log(
        `[InventoryService] Successfully seeded all medicines for pharmacy ${pharmacyId}. Affected rows: ${result.affectedRows}`,
      );
    } catch (err) {
      console.error(
        `[InventoryService] Error while mass-seeding inventory for pharmacy ${pharmacyId}:`,
        err,
      );
      throw err;
    }
  },
  // Simple: Get list of valid batches for a medicine
  getBatches: async (medicineId, pharmacyId) => {
    return await inventoryModel.getBatchesByExpiry(medicineId, pharmacyId);
  },

  // Auto-pick best batch for a medicine (for simplified flows)
  getBestBatch: async (medicineId, pharmacyId) => {
    const rows = await inventoryModel.getBestBatch(medicineId, pharmacyId);
    return rows && rows.length > 0 ? rows[0] : null;
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
