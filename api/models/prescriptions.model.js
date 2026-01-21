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
    return query(`SELECT * FROM prescriptions WHERE id = ? LIMIT 1`, [id]);
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
};

module.exports = prescriptionsModel;
