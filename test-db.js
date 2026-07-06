const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Connected successfully!");

    const result = await client.query("SELECT version();");
    console.log(result.rows[0]);

    await client.end();
  } catch (err) {
    console.error("❌ Connection failed");
    console.error(err);
  }
})();