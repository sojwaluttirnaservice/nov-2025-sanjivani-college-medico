const { query } = require("../utils/query/query");

const prescriptionsModel = {
  create: (data) => {
    const q = `
      INSERT INTO prescriptions (
        customer_id,
        pharmacy_id,
        file_path,
        notes
      ) VALUES (?, ?, ?, ?)
    `;
    return query(q, [
      data.customer_id,
      data.pharmacy_id || null,
      data.file_path,
      data.notes || null,
    ]);
  },

  getById: (id) => {
    return query(
      `
      SELECT p.*, c.full_name as customer_name, c.phone as customer_phone
      FROM prescriptions p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.id = ?
      LIMIT 1
      `,
      [id],
    );
  },

  getByCustomer: (customerId) => {
    return query(
      `SELECT * FROM prescriptions WHERE customer_id = ? ORDER BY createdAt DESC`,
      [customerId],
    );
  },

  assignPharmacy: (prescriptionId, pharmacyId) => {
    return query(`UPDATE prescriptions SET pharmacy_id = ? WHERE id = ?`, [
      pharmacyId,
      prescriptionId,
    ]);
  },

  markVerified: (prescriptionId, verifiedBy) => {
    return query(
      `
      UPDATE prescriptions
      SET is_verified = 1,
          verified_by = ?,
          verified_at = NOW()
      WHERE id = ?
      `,
      [verifiedBy, prescriptionId],
    );
  },

  /**
   * Get prescriptions for a pharmacy that haven't been converted to orders yet
   */
  getPendingByPharmacy: (pharmacyId) => {
    const q = `
      SELECT 
        p.*, 
        c.full_name as customer_name,
        c.phone as customer_phone
      FROM prescriptions p
      JOIN customers c ON p.customer_id = c.id
      LEFT JOIN orders o ON p.id = o.prescription_id
      WHERE p.pharmacy_id = ? AND o.id IS NULL
      ORDER BY p.id DESC
    `;
    return query(q, [pharmacyId]);
  },
};

module.exports = prescriptionsModel;
