const { query } = require("../utils/query/query");

const inventoryModel = {
  // Get all inventory items for a specific pharmacy, aggregated by medicine
  getInventoryByPharmacyId: (pharmacyId) => {
    // Aggregates batches to show total stock per medicine for the main list
    const sql = `
      SELECT 
        m.id as medicine_id, 
        m.name as medicine_name, 
        m.brand, 
        m.category, 
        m.dosage_form,
        SUM(pi.quantity) as total_physical,
        0 as total_reserved,
        SUM(pi.quantity) as quantity, -- Available quantity
        MIN(pi.expiry_date) as nearest_expiry,
        MAX(pi.price) as price 
      FROM pharmacy_inventory pi
      JOIN medicines m ON pi.medicine_id = m.id
      WHERE pi.pharmacy_id = ?
      GROUP BY m.id
    `;
    return query(sql, [pharmacyId]);
  },

  // Get specific batches for a medicine (FEFO)
  getBatchesByExpiry: (medicineId, pharmacyId) => {
    const sql = `
      SELECT * 
      FROM pharmacy_inventory 
      WHERE medicine_id = ? AND pharmacy_id = ? 
      AND expiry_date > CURRENT_DATE
      ORDER BY expiry_date ASC
    `;
    return query(sql, [medicineId, pharmacyId]);
  },

  // Add new stock batch
  addStock: (data) => {
    const sql = `
      INSERT INTO pharmacy_inventory 
      (pharmacy_id, medicine_id, quantity, price, expiry_date, batch_no) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return query(sql, [
      data.pharmacyId,
      data.medicineId,
      data.quantity,
      data.price,
      data.expiryDate,
      data.batch_no,
    ]);
  },

  // Simple: Get single batch details
  getBatchById: (id) => {
    return query("SELECT * FROM pharmacy_inventory WHERE id = ?", [id]).then(
      (res) => res[0],
    );
  },

  // Simple: Update physical quantity directly
  updateQuantity: (id, newQuantity) => {
    return query("UPDATE pharmacy_inventory SET quantity = ? WHERE id = ?", [
      newQuantity,
      id,
    ]);
  },

  // Update stock quantity and price
  updateStock: (id, data) => {
    const sql = `
      UPDATE pharmacy_inventory 
      SET quantity = ?, price = ? 
      WHERE id = ?
    `;
    return query(sql, [data.quantity, data.price, id]);
  },

  // Reserve stock (No-op if schema doesn't support it, but keeping signature for now)
  reserveStock: (inventoryId, quantity) => {
    // Schema doesn't have reserved_quantity yet, so we just return success
    return Promise.resolve({
      success: true,
      message: "Reservation skipped - schema mismatch",
    });
  },

  // Get low stock items
  getLowStock: (pharmacyId, threshold = 10) => {
    const sql = `
      SELECT 
        m.id as medicine_id, 
        m.name as medicine_name,
        SUM(pi.quantity) as available_quantity
      FROM pharmacy_inventory pi
      JOIN medicines m ON pi.medicine_id = m.id
      WHERE pi.pharmacy_id = ?
      GROUP BY m.id
      HAVING available_quantity <= ?
    `;
    return query(sql, [pharmacyId, threshold]);
  },
};

module.exports = inventoryModel;
