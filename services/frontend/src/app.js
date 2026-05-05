const express = require("express");
const axios = require("axios");

const app = express();

// Backend service URL (THIS WILL BREAK IF MISCONFIGURED)
const BACKEND_URL = process.env.BACKEND_URL;
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/data`);
    res.send(`
      <h1>Frontend</h1>
      <pre>${JSON.stringify(response.data, null, 2)}</pre>
    `);
  } catch (err) {
    res.send("Error connecting to backend");
  }
});

app.listen(3000, () => console.log("Frontend running on port 3000"));
