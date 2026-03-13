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
        c.full_name as customer_name,
        c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.pharmacy_id = ?
      ORDER BY o.placed_at DESC
    `;
    return query(sql, [pharmacyId]);
  },

  // Get all orders for a customer (My Orders)
  getOrdersByCustomerId: (customerId) => {
    const sql = `
      SELECT 
        o.id, 
        o.total_amount, 
        o.payment_status, 
        o.order_status, 
        o.placed_at,
        p.pharmacy_name
      FROM orders o
      JOIN pharmacies p ON o.pharmacy_id = p.id
      WHERE o.customer_id = ?
      ORDER BY o.placed_at DESC
    `;
    return query(sql, [customerId]);
  },

  // Get details of a specific order including items
  getOrderDetails: async (orderId) => {
    const orderSql = `
      SELECT 
        o.*, 
        c.full_name as customer_name, 
        c.phone, 
        c.address as customer_address
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `;

    const itemsSql = `
      SELECT 
        oi.id,
        oi.medicine_id,
        oi.quantity,
        oi.unit_price,
        oi.subtotal,
        m.name as medicine_name, 
        m.manufacturer as brand
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
    if (status === "DELIVERED") {
      const sql = `UPDATE orders SET order_status = ?, delivered_at = NOW() WHERE id = ?`;
      return query(sql, [status, orderId]);
    }
    const sql = `UPDATE orders SET order_status = ? WHERE id = ?`;
    return query(sql, [status, orderId]);
  },

  // Update payment status
  updatePaymentStatus: (orderId, status) => {
    const sql = `UPDATE orders SET payment_status = ? WHERE id = ?`;
    return query(sql, [status, orderId]);
  },

  // Create new order
  create: (data) => {
    const q = `
        INSERT INTO orders (
            customer_id, pharmacy_id, prescription_id, total_amount, 
            payment_status, order_status, delivery_address, delivery_agent_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return query(q, [
      data.customer_id,
      data.pharmacy_id,
      data.prescription_id || null,
      data.total_amount,
      data.payment_status || "PENDING",
      data.order_status || "CONFIRMED",
      data.delivery_address || "Pick up at Store",
      data.delivery_agent_id || null,
    ]);
  },

  // Add item to order
  addOrderItem: (data) => {
    const unitPrice = parseFloat(data.price || 0);
    const qty = parseInt(data.quantity || 1);
    const q = `
      INSERT INTO order_items (order_id, medicine_id, quantity, unit_price, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `;
    return query(q, [
      data.order_id,
      data.medicine_id,
      qty,
      unitPrice,
      unitPrice * qty,
    ]);
  },

  // Get pharmacy stats (Revenue, Active Orders)
  getStats: async (pharmacyId) => {
    const sql = `
      SELECT 
        COALESCE(SUM(CASE WHEN order_status = 'DELIVERED' THEN total_amount ELSE 0 END), 0) as total_revenue,
        COUNT(CASE WHEN order_status NOT IN ('DELIVERED', 'CANCELLED') THEN 1 END) as active_orders,
        COUNT(id) as total_orders
      FROM orders
      WHERE pharmacy_id = ?
    `;
    const results = await query(sql, [pharmacyId]);
    return results[0];
  },
};

module.exports = ordersModel;
