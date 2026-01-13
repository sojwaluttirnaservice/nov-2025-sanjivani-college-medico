const { query } = require("../utils/query/query");

// Since there is no direct assignment table yet, we will fetch orders
// that are likely relevant for delivery (e.g., status='ready' or 'out_for_delivery')
const deliveriesModel = {
  // Get active deliveries (simulated by status)
  // Ideally, this should filter by agent_id if assignment existed
  getActiveDeliveries: () => {
    const sql = `
      SELECT 
        o.id, 
        o.order_status, 
        o.delivery_address, 
        c.name as customer_name, 
        c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.order_status IN ('ready', 'out_for_delivery')
      ORDER BY o.placed_at ASC
    `;
    return query(sql);
  },

  // Get delivery history for an agent (simulated)
  getHistory: (agentId) => {
    // This would normally join with a deliveries table
    // For now, return completed orders
    const sql = `
      SELECT 
        o.id, 
        o.order_status, 
        o.delivered_at, 
        o.total_amount, /* earnings calc would go here */
        c.name as customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.order_status = 'delivered'
      ORDER BY o.delivered_at DESC
      LIMIT 10
    `;
    return query(sql);
  },
};

module.exports = deliveriesModel;
