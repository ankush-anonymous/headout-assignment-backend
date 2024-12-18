const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
  const googleAppsScriptUrl = process.env.APPSCRIPT_URL;
  console.log("Received request body:", req.body); // Log incoming request

  try {
    const response = await axios.post(googleAppsScriptUrl, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Apps Script response:", response.data); // Log Apps Script response
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding to Apps Script:", error.message);
    res.status(500).send("Error forwarding request.");
  }
});

app.get("/", (req, res) => {
  res.send("Proxy server is running!");
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
