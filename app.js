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
    "https://script.google.com/macros/s/AKfycbzzq4AlfUonWPyG3cR_I5RaazicD4bVB_uxPHx83t-lX0Z4vdK8d4jJt1QSu4qiaQ/exec"; // Replace with your deployed URL

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
    "https://script.google.com/macros/s/AKfycbz0F2wEI74mVFaA-0SLwVNEwyiicv3NX2-SIHLsWThnwDGxZIFrW4pmlq7Q98N-OIyR/exec"; // Replace with your deployed URL

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

app.get("/proxy/feedback/getdata", async (req, res) => {
  try {
    const response = await axios.get(
      "https://script.google.com/macros/s/AKfycbyS2__OWKoKSOLrVPOlnAwZI0XEY2zGiBR4QqUTQ-js4_wP43CGRqcf8-cqZkv0hOIj/exec"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
