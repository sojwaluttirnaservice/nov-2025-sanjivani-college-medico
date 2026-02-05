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
        SUM(pi.physical_quantity) as total_physical,
        SUM(pi.reserved_quantity) as total_reserved,
        SUM(pi.physical_quantity - pi.reserved_quantity) as quantity, -- Available quantity
        MIN(pi.expiry_date) as nearest_expiry,
        MAX(pi.price) as price -- Showing max price or could be avg
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
      (pharmacy_id, medicine_id, batch_no, physical_quantity, price, expiry_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return query(sql, [
      data.pharmacyId,
      data.medicineId,
      data.batch_no,
      data.quantity, // This is physical_quantity
      data.price,
      data.expiryDate,
    ]);
  },

  // Simple: Get single batch details
  getBatchById: (id) => {
    return query("SELECT * FROM pharmacy_inventory WHERE id = ?", [id]).then(
      (res) => res[0],
    );
  },

  // Simple: Update physical quantity directly (No reservation logic needed for Diploma)
  updateQuantity: (id, newQuantity) => {
    return query(
      "UPDATE pharmacy_inventory SET physical_quantity = ? WHERE id = ?",
      [newQuantity, id],
    );
  },

  // Update stock quantity and price (Legacy/General update)
  updateStock: (id, data) => {
    const sql = `
      UPDATE pharmacy_inventory 
      SET physical_quantity = ?, price = ? 
      WHERE id = ?
    `;
    return query(sql, [data.quantity, data.price, id]);
  },

  // Reserve stock (Increment reserved_quantity)
  reserveStock: (inventoryId, quantity) => {
    const sql = `
      UPDATE pharmacy_inventory
      SET reserved_quantity = reserved_quantity + ?
      WHERE id = ?
    `;
    return query(sql, [quantity, inventoryId]);
  },

  // Get low stock items
  getLowStock: (pharmacyId, threshold = 10) => {
    const sql = `
      SELECT 
        m.id as medicine_id, 
        m.name as medicine_name,
        SUM(pi.physical_quantity - pi.reserved_quantity) as available_quantity
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
