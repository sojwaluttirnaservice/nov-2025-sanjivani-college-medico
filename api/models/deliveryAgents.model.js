const { query } = require("../utils/query/query");

const deliveryAgentsModel = {
  /**
   * Check if a delivery agent profile exists for a given user
   */
  checkByUserId: (userId) => {
    const q = `
      SELECT 
        id,
        id AS agent_id,
        user_id,
        full_name,
        phone,
        vehicle_number,
        is_available,
        current_location
      FROM delivery_agents
      WHERE user_id = ?
      LIMIT 1
    `;
    return query(q, [userId]);
  },

  /**
   * Get delivery agent with linked user info
   */
  getWithUser: (userId) => {
    const q = `
      SELECT
        da.id,
        da.id AS agent_id,
        da.full_name,
        da.phone,
        da.vehicle_number,
        da.is_available,
        da.current_location,
        u.id AS user_id,
        u.email,
        u.role
      FROM delivery_agents da
      INNER JOIN users u ON u.id = da.user_id
      WHERE da.user_id = ?
      LIMIT 1
    `;
    return query(q, [userId]);
  },

  /**
   * Create a new delivery agent profile
   */
  create: (data) => {
    const q = `
      INSERT INTO delivery_agents (user_id, full_name, phone, vehicle_number)
      VALUES (?, ?, ?, ?)
    `;
    return query(q, [
      data.user_id,
      data.full_name,
      data.phone,
      data.vehicle_number || null,
    ]);
  },

  /**
   * Update availability status
   */
  updateAvailability: (agentId, isAvailable) => {
    return query(`UPDATE delivery_agents SET is_available = ? WHERE id = ?`, [
      isAvailable ? 1 : 0,
      agentId,
    ]);
  },

  /**
   * Get all delivery agents
   */
  getAll: () => {
    const q = `
      SELECT
        da.id,
        da.id AS agent_id,
        da.full_name,
        da.phone,
        da.vehicle_number,
        da.is_available,
        da.current_location,
        u.id AS user_id,
        u.email
      FROM delivery_agents da
      INNER JOIN users u ON u.id = da.user_id
      ORDER BY da.full_name ASC
    `;
    return query(q);
  },
};

module.exports = deliveryAgentsModel;
