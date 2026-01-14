const { query } = require("../utils/query/query");

const ordersModel = {
  // Get all orders for a pharmacy
  getOrdersByPharmacyId: (pharmacyId) => {
    const sql = `
      SELECT 
        o.id, 
        o.total_amount, 
        o.payment_status, 
        o.order_status, 
        o.placed_at, 
        c.name as customer_name,
        c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.pharmacy_id = ?
      ORDER BY o.placed_at DESC
    `;
    return query(sql, [pharmacyId]);
  },

  // Get details of a specific order including items
  getOrderDetails: async (orderId) => {
    const orderSql = `
      SELECT 
        o.*, 
        c.name as customer_name, 
        c.phone, 
        c.address as customer_address
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `;

    const itemsSql = `
      SELECT 
        oi.*, 
        m.name as medicine_name, 
        m.brand
      FROM order_items oi
      JOIN medicines m ON oi.medicine_id = m.id
      WHERE oi.order_id = ?
    `;

    const [order] = await query(orderSql, [orderId]);
    if (!order) return null;

    const items = await query(itemsSql, [orderId]);
    return { ...order, items };
  },

  // Update order status
  updateStatus: (orderId, status) => {
    const sql = `UPDATE orders SET order_status = ? WHERE id = ?`;
    return query(sql, [status, orderId]);
  },
};

module.exports = ordersModel;
