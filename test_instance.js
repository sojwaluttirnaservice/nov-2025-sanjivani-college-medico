const { instance } = require("./client/src/utils/instance.js");

async function test() {
  try {
    const res = await instance.get("/users/me"); // Just to see format
    console.log("Raw response from instance.get:", res);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
