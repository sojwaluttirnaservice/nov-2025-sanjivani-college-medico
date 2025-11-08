const mysql = require('mysql2');
const config = require('./config');
// console.log(config)
const pool = mysql.createPool({
  ...config.db, // Spread operator to use all properties from config.db,

  connectionLimit: 10,

  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0,

});

const db = pool.promise();

module.exports = db