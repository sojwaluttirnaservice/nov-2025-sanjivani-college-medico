require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
  });

  const [pharmacies] = await connection.execute('SELECT email, password FROM users WHERE role = "pharmacy" LIMIT 1');
  const [agents] = await connection.execute('SELECT email, password FROM users WHERE role = "delivery_agent" LIMIT 1');

  console.log('Pharmacy User:', pharmacies[0]);
  console.log('Delivery Agent:', agents[0]);

  await connection.end();
}
main().catch(console.error);
