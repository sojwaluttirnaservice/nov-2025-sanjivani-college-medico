const { query } = require("../utils/query/query");

const restockRequestModel = {
  // Create a new restock request
  create: (data) => {
    const sql = `
      INSERT INTO restock_requests 
      (pharmacy_id, medicine_id, delivery_agent_id, quantity_requested, price, expiry_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `;
    return query(sql, [
      data.pharmacy_id,
      data.medicine_id,
      data.delivery_agent_id || null,
      data.quantity_requested,
      data.price || 0,
      data.expiry_date || null,
      data.notes || null,
    ]);
  },

  // Get all restock requests for a specific pharmacy (with medicine + agent info)
  getByPharmacy: (pharmacyId) => {
    const sql = `
      SELECT 
        rr.id,
        rr.quantity_requested,
        rr.price,
        rr.expiry_date,
        rr.status,
        rr.batch_no,
        rr.notes,
        rr.createdAt,
        rr.updatedAt,
        m.id as medicine_id,
        m.name as medicine_name,
        m.type as dosage_form,
        da.id as agent_id,
        da.full_name as agent_name,
        da.phone as agent_phone
      FROM restock_requests rr
      JOIN medicines m ON rr.medicine_id = m.id
      LEFT JOIN delivery_agents da ON rr.delivery_agent_id = da.id
      WHERE rr.pharmacy_id = ?
      ORDER BY rr.createdAt DESC
    `;
    return query(sql, [pharmacyId]);
  },

  // Get all pending restock requests for a specific delivery agent
  // Also includes requests not assigned to any specific agent (open for anyone)
  getByAgent: (agentId) => {
    const sql = `
      SELECT 
        rr.id,
        rr.quantity_requested,
        rr.price,
        rr.expiry_date,
        rr.status,
        rr.notes,
        rr.createdAt,
        rr.delivery_agent_id,
        m.id as medicine_id,
        m.name as medicine_name,
        m.type as dosage_form,
        p.id as pharmacy_id,
        p.pharmacy_name,
        p.address as pharmacy_address,
        p.contact_no as pharmacy_phone
      FROM restock_requests rr
      JOIN medicines m ON rr.medicine_id = m.id
      JOIN pharmacies p ON rr.pharmacy_id = p.id
      WHERE rr.status = 'pending'
        AND (rr.delivery_agent_id = ? OR rr.delivery_agent_id IS NULL)
      ORDER BY rr.createdAt ASC
    `;
    return query(sql, [agentId]);
  },

  // Get a single restock request by ID (with all details)
  getById: (id) => {
    const sql = `
      SELECT 
        rr.*,
        m.name as medicine_name,
        m.type as dosage_form,
        p.pharmacy_name,
        p.address as pharmacy_address,
        da.full_name as agent_name
      FROM restock_requests rr
      JOIN medicines m ON rr.medicine_id = m.id
      JOIN pharmacies p ON rr.pharmacy_id = p.id
      LEFT JOIN delivery_agents da ON rr.delivery_agent_id = da.id
      WHERE rr.id = ?
    `;
    return query(sql, [id]).then((res) => res[0]);
  },

  // Update the status and optionally the batch_no
  updateStatus: (id, status, batch_no = null) => {
    const sql = `
      UPDATE restock_requests
      SET status = ?, batch_no = COALESCE(?, batch_no)
      WHERE id = ?
    `;
    return query(sql, [status, batch_no, id]);
  },

  // Get all delivery agents for pharmacy to choose from
  getAllAgents: () => {
    const sql = `
      SELECT id, full_name, phone, is_available, current_location
      FROM delivery_agents
      ORDER BY is_available DESC, full_name ASC
    `;
    return query(sql);
  },
};

module.exports = restockRequestModel;
