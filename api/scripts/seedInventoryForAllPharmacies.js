require("dotenv").config({ path: "../.env" });
const mysql = require("mysql2/promise");

async function seedAllPharmacies() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT || 3306,
    });

    console.log("Connected to the database. Fetching all pharmacies...");

    // 1. Get all pharmacy IDs
    const [pharmacies] = await connection.execute(
      "SELECT id, pharmacy_name FROM pharmacies",
    );

    if (pharmacies.length === 0) {
      console.log("No pharmacies found. Exiting.");
      return;
    }

    console.log(
      `Found ${pharmacies.length} pharmacies. Starting mass seeding...`,
    );

    // 2. Loop and mass-insert
    for (const pharmacy of pharmacies) {
      console.log(
        `\nSeeding inventory for Pharmacy: ${pharmacy.pharmacy_name} (ID: ${pharmacy.id})...`,
      );

      const sql = `
        INSERT IGNORE INTO pharmacy_inventory 
        (pharmacy_id, medicine_id, quantity, price, expiry_date)
        SELECT 
          ?, 
          id, 
          100, 
          price, 
          DATE_ADD(CURRENT_DATE, INTERVAL 2 YEAR)
        FROM medicines
      `;

      const [result] = await connection.execute(sql, [pharmacy.id]);
      console.log(
        `✅ Success for ${pharmacy.pharmacy_name}! Affected rows: ${result.affectedRows}`,
      );
    }

    console.log("\nMass Seeding Complete for all existing pharmacies!");
  } catch (error) {
    console.error("Error during mass seeding:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

seedAllPharmacies();
