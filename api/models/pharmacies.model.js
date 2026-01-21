const { query } = require("../utils/query/query");

const pharmaciesModel = {
  /**
   * Check if pharmacy exists for a given user
   */
  checkByUserId: (userId) => {
    const q = `
            SELECT
                id AS pharmacy_id,
                user_id,
                pharmacy_name,
                license_no,
                contact_no,
                is_verified
            FROM pharmacies
            WHERE user_id = ?
            LIMIT 1
        `;
    return query(q, [userId]);
  },

  /**
   * Create new pharmacy
   */
  create: (data) => {
    const q = `
            INSERT INTO pharmacies (
                user_id,
                pharmacy_name,
                license_no,
                contact_no,
                address,
                city,
                pincode
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    return query(q, [
      data.user_id,
      data.pharmacy_name,
      data.license_no,
      data.contact_no,
      data.address,
      data.city || null,
      data.pincode || null,
    ]);
  },

  /**
   * Update pharmacy by user_id
   */
  updateByUserId: (userId, data) => {
    const q = `
            UPDATE pharmacies
            SET
                pharmacy_name = ?,
                license_no = ?,
                contact_no = ?,
                address = ?,
                city = ?,
                pincode = ?
            WHERE user_id = ?
        `;
    return query(q, [
      data.pharmacy_name,
      data.license_no,
      data.contact_no,
      data.address,
      data.city || null,
      data.pincode || null,
      userId,
    ]);
  },

  /**
   * Get pharmacy by pharmacy ID
   */
  getById: (pharmacyId) => {
    const q = `
            SELECT *
            FROM pharmacies
            WHERE id = ?
            LIMIT 1
        `;
    return query(q, [pharmacyId]);
  },

  /**
   * Get pharmacy with linked user info
   */
  getWithUser: (userId) => {
    const q = `
            SELECT
                p.id AS pharmacy_id,
                p.pharmacy_name,
                p.license_no,
                p.contact_no,
                p.address,
                p.city,
                p.pincode,
                p.is_verified,
                u.id AS user_id,
                u.email,
                u.role
            FROM pharmacies p
            INNER JOIN users u ON u.id = p.user_id
            WHERE p.user_id = ?
            LIMIT 1
        `;
    return query(q, [userId]);
  },

  /**
   * Verify pharmacy (admin action)
   */
  verifyById: (pharmacyId) => {
    const q = `
            UPDATE pharmacies
            SET is_verified = 1
            WHERE id = ?
        `;
    return query(q, [pharmacyId]);
  },

  /**
   * Delete pharmacy (rare, admin use)
   */
  deleteByUserId: (userId) => {
    const q = `
            DELETE FROM pharmacies
            WHERE user_id = ?
        `;
    return query(q, [userId]);
  },
};

module.exports = pharmaciesModel;
