const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// First proxy route
app.post("/proxy", async (req, res) => {
  const googleAppsScriptUrl =
    "https://script.google.com/macros/s/AKfycbzzq4AlfUonWPyG3cR_I5RaazicD4bVB_uxPHx83t-lX0Z4vdK8d4jJt1QSu4qiaQ/exec";

  console.log("Received request body (proxy):", req.body);

  try {
    const response = await axios.post(googleAppsScriptUrl, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Apps Script response (proxy):", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding to Apps Script (proxy):", error.message);
    res.status(500).send("Error forwarding request.");
  }
});

// Second proxy route
app.post("/proxy2", async (req, res) => {
  const googleAppsScriptUrl2 =
    "https://script.google.com/macros/s/AKfycbxajOYlXh053kmZaTmQKm79RiqfAFX0BmeuzqwajoHoYwovh05Dfs54DMFdaCAYUCAO/exec";

  console.log("Received request body (proxy2):", req.body);

  try {
    const response = await axios.post(googleAppsScriptUrl2, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Apps Script response (proxy2):", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding to Apps Script (proxy2):", error.message);
    res.status(500).send("Error forwarding request.");
  }
});

app.get("/", (req, res) => {
  res.send("Proxy server is running!");
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
