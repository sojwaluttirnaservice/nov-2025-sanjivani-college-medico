const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const sequelize = require("../config/sequelize");
const medicineSchema = require("../schemas/medicines");

async function seedCSV() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database. Checking schema...");
    // Only alter if absolutely necessary, but we'll try just syncing safely.
    await medicineSchema.sync();

    const csvFilePath = path.join(
      __dirname,
      "../A_Z_medicines_dataset_of_India.csv",
    );
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV not found at: ${csvFilePath}`);
      process.exit(1);
    }

    console.log("Reading CSV stream and batch inserting...");

    let batch = [];
    let count = 0;
    const BATCH_SIZE = 2000;
    let insertedCount = 0;

    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(csvFilePath).pipe(csv());

      stream
        .on("data", (row) => {
          // Map CSV columns to our schema
          const med = {
            name: (row.name || "").trim().substring(0, 250),
            price: parseFloat(row["price(₹)"]) || 0.0,
            is_discontinued: row.Is_discontinued === "True",
            manufacturer: (row.manufacturer_name || "")
              .trim()
              .substring(0, 250),
            type: (row.type || "").trim().substring(0, 50),
            pack_size: (row.pack_size_label || "").trim().substring(0, 100),
            composition1: (row.short_composition1 || "")
              .trim()
              .substring(0, 250),
            composition2: (row.short_composition2 || "")
              .trim()
              .substring(0, 250),
          };

          if (med.name) {
            batch.push(med);
            count++;
          }

          if (batch.length >= BATCH_SIZE) {
            stream.pause(); // Pause to wait for DB insert
            const currentBatch = [...batch];
            batch = [];

            medicineSchema
              .bulkCreate(currentBatch, {
                ignoreDuplicates: true,
                logging: false,
              })
              .then(() => {
                insertedCount += currentBatch.length;
                if (insertedCount % 10000 === 0) {
                  console.log(
                    `Successfully inserted ${insertedCount} records so far...`,
                  );
                }
                stream.resume();
              })
              .catch((err) => {
                console.error("Batch insert failed:", err.message);
                stream.resume(); // keep going even on batch error
              });
          }
        })
        .on("end", async () => {
          try {
            if (batch.length > 0) {
              await medicineSchema.bulkCreate(batch, {
                ignoreDuplicates: true,
                logging: false,
              });
              insertedCount += batch.length;
            }
            console.log(
              `Finished parsing. Successfully seeded a total of ${insertedCount} medicines from CSV!`,
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .on("error", reject);
    });
  } catch (error) {
    console.error("Failed to seed medicines:", error);
  }
}

seedCSV()
  .then(() => {
    console.log("Script completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Fatal Error:", err);
    process.exit(1);
  });
