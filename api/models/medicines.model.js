const { query } = require("../utils/query/query");

const medicinesModel = {
  // Search medicines by name or brand
  search: async (searchTerm) => {
    const sql = `
      SELECT id, name, brand, dosage_form
      FROM medicines
      WHERE name LIKE ? OR brand LIKE ?
      LIMIT 20
    `;
    const likeTerm = `%${searchTerm}%`;
    return query(sql, [likeTerm, likeTerm]);
  },

  // Get medicine by ID
  getById: async (id) => {
    const sql = `SELECT * FROM medicines WHERE id = ?`;
    const [result] = await query(sql, [id]);
    return result;
  },

  // Create new medicine (for handling unknown/analyzed medicines)
  create: async (data) => {
    const sql = `INSERT INTO medicines (name, brand, dosage_form) VALUES (?, ?, ?)`;
    // If ID is provided (e.g. from analysis), we might want to insert with ID?
    // But usually ID is auto-increment.
    // If analysis returns ID=1, and we insert, we get a new ID.
    // The issue is the ORDER refers to ID=1.
    // If we want to support the specific ID from analysis, we need to insert WITH ID.
    // Let's try to insert with ID if possible, or mapping.
    // For now, simple insert.
    return query(sql, [
      data.name || "Unknown Medicine",
      data.brand || "Generic",
      data.dosage_form || "Tablet",
    ]);
  },

  // Create with specific ID (Use with caution - only for syncing/mocking)
  createWithId: async (id, data) => {
    const sql = `INSERT INTO medicines (id, name, brand, dosage_form) VALUES (?, ?, ?, ?)`;
    return query(sql, [
      id,
      data.name || "Unknown Medicine",
      data.brand || "Generic",
      data.dosage_form || "Tablet",
    ]);
  },
};

module.exports = medicinesModel;
