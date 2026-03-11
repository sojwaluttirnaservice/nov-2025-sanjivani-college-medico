const { query } = require("../utils/query/query");

const inventoryModel = {
  // Get all inventory items for a specific pharmacy, aggregated by medicine
  getInventoryByPharmacyId: async (
    pharmacyId,
    offset = 0,
    limit = 50,
    search = "",
  ) => {
    // Aggregates batches to show total stock per medicine for the main list
    let sql = `
      SELECT 
        m.id as medicine_id, 
        m.name as medicine_name, 
        m.manufacturer AS manufacturer, 
        m.type, 
        m.type AS dosage_form, -- Retained as alias temporarily if needed
        SUM(pi.quantity) as total_physical,
        0 as total_reserved,
        SUM(pi.quantity) as quantity, -- Available quantity
        MIN(pi.expiry_date) as nearest_expiry,
        MAX(pi.price) as price 
      FROM pharmacy_inventory pi
      JOIN medicines m ON pi.medicine_id = m.id
      WHERE pi.pharmacy_id = ?
    `;
    const params = [pharmacyId];

    let countSql = "";
    const countParams = [pharmacyId];

    if (search && search.trim() !== "") {
      countSql = `
        SELECT COUNT(DISTINCT pi.medicine_id) as total
        FROM pharmacy_inventory pi
        JOIN medicines m ON pi.medicine_id = m.id
        WHERE pi.pharmacy_id = ? AND m.name LIKE ?
      `;
      countParams.push(`%${search.trim()}%`);
    } else {
      // Fast path: simply count rows without joining when there's no search
      countSql = `SELECT COUNT(*) as total FROM pharmacy_inventory WHERE pharmacy_id = ?`;
    }

    if (search && search.trim() !== "") {
      sql += ` AND m.name LIKE ?`;
      params.push(`%${search.trim()}%`);
    }

    sql += ` GROUP BY m.id`;

    // Only order by name if searching, otherwise the DB scan is too slow for 253k records
    if (search && search.trim() !== "") {
      sql += ` ORDER BY m.name ASC`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const inventory = await query(sql, params);
    const countResult = await query(countSql, countParams);

    return {
      inventory,
      totalCount:
        countResult && countResult.length > 0 ? countResult[0].total : 0,
    };
  },

  // Get specific batches for a medicine (FEFO - First Expire First Out)
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

  // Auto-pick the best batch for a medicine (highest qty, valid expiry)
  getBestBatch: (medicineId, pharmacyId) => {
    const sql = `
      SELECT * 
      FROM pharmacy_inventory 
      WHERE medicine_id = ? AND pharmacy_id = ? 
      AND expiry_date > CURRENT_DATE
      AND quantity > 0
      ORDER BY quantity DESC, expiry_date DESC
      LIMIT 1
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
    // Optimized: First aggregate the inventory for the given pharmacy, then filter by threshold,
    // and ONLY join the medicines table for the few resulting rows.
    const sql = `
      SELECT 
        m.id as medicine_id, 
        m.name as medicine_name,
        sub.available_quantity
      FROM (
        SELECT medicine_id, SUM(quantity) as available_quantity
        FROM pharmacy_inventory
        WHERE pharmacy_id = ?
        GROUP BY medicine_id
        HAVING available_quantity <= ?
        LIMIT 20
      ) sub
      JOIN medicines m ON m.id = sub.medicine_id
    `;
    return query(sql, [pharmacyId, threshold]);
  },
};

module.exports = inventoryModel;
