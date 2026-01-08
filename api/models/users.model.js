const { query } = require("../utils/query/query");

const usersModel = {
  createUser: (userData) => {
    const q = `INSERT INTO users
                (email, password)
                VALUES
                (?, ?)`;

    return query(q, [userData.email, userData.password, userData.role]);
  },

  getUserByEmail: (email) => {
    return query(
      `SELECT id, email, password, role FROM users WHERE email = ?`,
      [email]
    );
  },

  getUserById: (userId) => {
    return query(`SELECT id, email, role FROM users WHERE id = ?`, [userId]);
  },

  getUsersByRole: (role) => {
    return query(`SELECT id, email, role FROM users WHERE role = ?`, [role]);
  },
};

module.exports = usersModel;
