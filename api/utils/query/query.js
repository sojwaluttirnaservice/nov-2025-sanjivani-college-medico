const db = require("../../config/db.connect");

const query = async (sqlQuery, params = [], conn = db) => {
  const [rows] = await conn.query(sqlQuery, params);
  return rows;
};

const queryOne = async (sqlQuery, params = [], conn = db) => {
  const rows = await query(sqlQuery, params, conn);
  return rows[0] || null;
};

const rawQuery = (sqlQuery, params = [], conn = db) => {
  return conn.query(sqlQuery, params); // full response
};

module.exports = {
  query,
  queryOne,
  rawQuery,
};
