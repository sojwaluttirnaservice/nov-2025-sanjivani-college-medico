const { query } = require("../utils/query/query");

const inventoryModel = {
  // Get all inventory items for a specific pharmacy
  getInventoryByPharmacyId: (pharmacyId) => {
    const sql = `
      SELECT 
        pi.id, 
        pi.quantity, 
        pi.price, 
        pi.expiry_date, 
        m.name as medicine_name, 
        m.brand, 
        m.category, 
        m.dosage_form
      FROM pharmacy_inventory pi
      JOIN medicines m ON pi.medicine_id = m.id
      WHERE pi.pharmacy_id = ?
      ORDER BY pi.updatedAt DESC
    `;
    return query(sql, [pharmacyId]);
  },

  // Add new stock (assumes medicine exists, otherwise need to create medicine first - simplified for now)
  addStock: (data) => {
    const sql = `
      INSERT INTO pharmacy_inventory 
      (pharmacy_id, medicine_id, quantity, price, expiry_date) 
      VALUES (?, ?, ?, ?, ?)
    `;
    return query(sql, [
      data.pharmacyId,
      data.medicineId,
      data.quantity,
      data.price,
      data.expiryDate,
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

  // Get low stock items
  getLowStock: (pharmacyId, threshold = 10) => {
    const sql = `
      SELECT 
        pi.id, 
        pi.quantity, 
        m.name as medicine_name 
      FROM pharmacy_inventory pi
      JOIN medicines m ON pi.medicine_id = m.id
      WHERE pi.pharmacy_id = ? AND pi.quantity <= ?
    `;
    return query(sql, [pharmacyId, threshold]);
  },
};

module.exports = inventoryModel;
