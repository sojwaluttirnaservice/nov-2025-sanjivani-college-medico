const { query, queryOne } = require("../utils/query/query");

// Since there is no direct assignment table yet, we will fetch orders
// that are likely relevant for delivery (e.g., status='ready' or 'out_for_delivery')
const deliveriesModel = {
  // Get active deliveries (simulated by status)
  // Ideally, this should filter by agent_id if assignment existed
  // Get active deliveries assigned to this specific agent
  getActiveDeliveries: (agentUserId) => {
    const sql = `
      SELECT 
        o.id, 
        o.order_status, 
        o.delivery_address, 
        c.full_name as customer_name, 
        c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN delivery_agents da ON o.delivery_agent_id = da.id
      WHERE o.order_status IN ('CONFIRMED', 'ready', 'out_for_delivery')
        AND da.user_id = ?
      ORDER BY o.placed_at ASC
    `;
    return query(sql, [agentUserId]);
  },

  // Get delivery history for a specific agent
  getHistory: (agentUserId) => {
    const sql = `
      SELECT 
        o.id, 
        o.order_status, 
        o.delivered_at, 
        o.placed_at,
        o.total_amount,
        c.full_name as customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN delivery_agents da ON o.delivery_agent_id = da.id
      WHERE o.order_status = 'DELIVERED'
        AND da.user_id = ?
      ORDER BY COALESCE(o.delivered_at, o.placed_at) DESC
      LIMIT 20
    `;
    return query(sql, [agentUserId]);
  },
};

module.exports = deliveriesModel;
