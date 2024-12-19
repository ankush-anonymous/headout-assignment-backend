const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy route for feedback
app.post("/proxy/feedback", async (req, res) => {
  const googleAppsScriptUrl =
    "https://script.google.com/macros/library/d/1Yi_24ITUi3DTLIL22r7a0cFX5aK8xKIiuFHkiooySFVWAXg-VDQfEdfY/1"; // Replace with your deployed URL

  console.log("Received request body (proxy/feedback):", req.body);

  try {
    const response = await axios.post(googleAppsScriptUrl, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Apps Script response (proxy/feedback):", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding to Apps Script (proxy/feedback):",
      error.message
    );
    res.status(500).send("Error forwarding request.");
  }
});

// Proxy route for rawdata
app.post("/proxy/rawdata", async (req, res) => {
  const googleAppsScriptUrl2 =
    "https://script.google.com/macros/s/AKfycbxajOYlXh053kmZaTmQKm79RiqfAFX0BmeuzqwajoHoYwovh05Dfs54DMFdaCAYUCAO/exec"; // Replace with your deployed URL

  console.log("Received request body (proxy/rawdata):", req.body);

  try {
    const response = await axios.post(googleAppsScriptUrl2, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Apps Script response (proxy/rawdata):", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding to Apps Script (proxy/rawdata):",
      error.message
    );
    res.status(500).send("Error forwarding request.");
  }
});

app.get("/", (req, res) => {
  res.send("Proxy server is running!");
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
