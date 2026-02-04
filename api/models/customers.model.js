const { query } = require("../utils/query/query");

const customersModel = {
  /**
   * Check if customer exists for a given user
   */
  checkByUserId: (userId) => {
    const q = `
            SELECT 
                id AS customer_id,
                user_id,
                full_name,
                phone,
                address,
                city,
                pincode
            FROM customers
            WHERE user_id = ?
        `;
    return query(q, [userId]);
  },

  /**
   * Create new customer
   */
  create: (data) => {
    const q = `
            INSERT INTO customers (
                user_id,
                full_name,
                phone,
                address,
                city,
                pincode
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
    return query(q, [
      data.user_id,
      data.full_name,
      data.phone,
      data.address,
      data.city || null,
      data.pincode || null,
    ]);
  },

  /**
   * Update customer by user_id
   */
  updateByUserId: (userId, data) => {
    const q = `
            UPDATE customers
            SET
                full_name = ?,
                phone = ?,
                address = ?,
                city = ?,
                pincode = ?
            WHERE user_id = ?
        `;
    return query(q, [
      data.full_name,
      data.phone,
      data.address,
      data.city || null,
      data.pincode || null,
      userId,
    ]);
  },

  /**
   * Get customer by customer ID
   */
  getById: (customerId) => {
    const q = `
            SELECT *
            FROM customers
            WHERE id = ?
            LIMIT 1
        `;
    return query(q, [customerId]);
  },

  /**
   * Get customer with linked user info
   */
  getWithUser: (userId) => {
    const q = `
            SELECT
                c.id AS customer_id,
                c.full_name,
                c.phone,
                c.address,
                c.city,
                c.pincode,
                u.id AS user_id,
                u.email,
                u.role
            FROM customers c
            INNER JOIN users u ON u.id = c.user_id
            WHERE c.user_id = ?
            LIMIT 1
        `;
    return query(q, [userId]);
  },

  /**
   * Delete customer (rare, admin use)
   */
  deleteByUserId: (userId) => {
    const q = `DELETE FROM customers WHERE user_id = ?`;
    return query(q, [userId]);
  },
};

module.exports = customersModel;
