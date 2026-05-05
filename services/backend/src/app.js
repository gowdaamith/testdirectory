const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

// ENV CONFIG
const APP_NAME = process.env.APP_NAME;
const ENV = process.env.ENVIRONMENT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

// VALIDATION (FOR CRASH LOOP TESTING)
if (!APP_NAME || !ENV || !DB_HOST) {
  console.error("Missing required config. Crashing...");
  process.exit(1);
}

// DB CONNECTION STRING
const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017`;
let db;

async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("testdb");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1); // crash intentionally
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "UP", env: ENV });
});

app.get("/data", async (req, res) => {
  try {
    const collection = db.collection("items");
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "DB query failed" });
  }
});

connectDB().then(() => {
  app.listen(3000, () => console.log("Backend running on port 3000"));
});
