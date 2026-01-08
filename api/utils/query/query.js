// db/db.utils.js

const query = async (sql, params = [], conn = db) => {
  const [rows] = await conn.query(sql, params);
  return rows;
};

const queryOne = async (sql, params = [], conn = db) => {
  const rows = await query(sql, params, conn);
  return rows[0] || null;
};

const rawQuery = (sql, params = [], conn = db) => {
  return conn.query(sql, params); // full response
};

module.exports = {
  query,
  queryOne,
  rawQuery,
};
