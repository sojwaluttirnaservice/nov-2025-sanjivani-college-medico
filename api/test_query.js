require("dotenv").config();
const pharmaciesModel = require("./models/pharmacies.model");

(async () => {
  try {
    console.log("--- TEST START ---");

    console.log("1. Testing getAll with NO params (Should return fallback)...");
    const res1 = await pharmaciesModel.getAll("", "", "");
    console.log("Count:", res1.length);
    if (res1.length > 0) {
      console.log(
        "First:",
        res1[0].pharmacy_name,
        "| City:",
        res1[0].city,
        "| Verified:",
        res1[0].is_verified,
      );
    } else {
      console.log("Result is EMPTY array.");
    }

    console.log("\n2. Testing getAll with City='Nashik'...");
    const res2 = await pharmaciesModel.getAll("", "Nashik", "");
    console.log("Count:", res2.length);

    console.log("\n3. Testing getAll with Search='Med'...");
    const res3 = await pharmaciesModel.getAll("Med", "", "");
    console.log("Count:", res3.length);
  } catch (e) {
    console.error("FATAL ERROR:", e);
  } finally {
    console.log("--- TEST END ---");
    process.exit();
  }
})();
