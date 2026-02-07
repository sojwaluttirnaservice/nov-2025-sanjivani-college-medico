const mysql = require("mysql2");
const config = require("./config");
// console.log(config)
const pool = mysql.createPool({
  ...config.db, // Spread operator to use all properties from config.db,

  connectionLimit: 10,

  queueLimit: 0,

  enableKeepAlive: false,
  connectTimeout: 60000, // 60 seconds
});

const db = pool.promise();

module.exports = db;
