const { query, queryOne } = require("../utils/query/query");

const medicinesModel = {
  search: async (searchTerm) => {
    const sql = `
      SELECT 
        id, 
        name, 
        manufacturer as brand,
        type as dosage_form,
        pack_size as strength,
        price,
        composition1
      FROM medicines
      WHERE name LIKE ? OR composition1 LIKE ? OR manufacturer LIKE ?
      LIMIT 50
    `;
    const likeTerm = `%${searchTerm}%`;
    return query(sql, [likeTerm, likeTerm, likeTerm]);
  },

  // Get medicine by ID
  getById: (id) => {
    const sql = `SELECT * FROM medicines WHERE id = ?`;
    return queryOne(sql, [id]);
  },

  // Create new medicine (for handling unknown/analyzed medicines)
  create: async (data) => {
    const sql = `INSERT INTO medicines (name, manufacturer, type) VALUES (?, ?, ?)`;
    // If ID is provided (e.g. from analysis), we might want to insert with ID?
    // But usually ID is auto-increment.
    // If analysis returns ID=1, and we insert, we get a new ID.
    // The issue is the ORDER refers to ID=1.
    // If we want to support the specific ID from analysis, we need to insert WITH ID.
    // Let's try to insert with ID if possible, or mapping.
    // For now, simple insert.
    return query(sql, [
      data.name || "Unknown Medicine",
      data.brand || data.manufacturer || "Generic",
      data.dosage_form || data.type || "Tablet",
    ]);
  },

  // Create with specific ID (Use with caution - only for syncing/mocking)
  createWithId: async (id, data) => {
    const sql = `INSERT INTO medicines (id, name, manufacturer, type) VALUES (?, ?, ?, ?)`;
    return query(sql, [
      id,
      data.name || "Unknown Medicine",
      data.brand || data.manufacturer || "Generic",
      data.dosage_form || data.type || "Tablet",
    ]);
  },
};

module.exports = medicinesModel;
