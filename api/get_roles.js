const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE
  });
  const [agents] = await conn.execute(`SELECT email FROM users WHERE role = 'DELIVERY_AGENT' LIMIT 1`);
  const [pharms] = await conn.execute(`SELECT email FROM users WHERE role = 'PHARMACY' LIMIT 1`);
  console.log('DELIVERY_AGENT:', agents[0]);
  console.log('PHARMACY:', pharms[0]);
  conn.end();
}
run();
