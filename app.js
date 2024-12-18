const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
  const googleAppsScriptUrl =
    "https://script.google.com/macros/s/AKfycbzzq4AlfUonWPyG3cR_I5RaazicD4bVB_uxPHx83t-lX0Z4vdK8d4jJt1QSu4qiaQ/exec";
  try {
    const response = await axios.post(googleAppsScriptUrl, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/", (req, res) => {
  res.send("Proxy server is running!");
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
