// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

const VERSIONS_FILE_PATH = path.join(__dirname, "versions", "versions.json");
const TRANSLATIONS_BASE_URL = `http://localhost:${port}/translations`;

// Middleware
app.use(cors());
app.use("/translations", express.static(path.join(__dirname, "translations")));

app.get("/versions/versions.json", (req, res) => {
  try {
    if (!fs.existsSync(VERSIONS_FILE_PATH)) {
      return res.status(404).json({ error: "versions.json not found" });
    }

    const versionsData = fs.readFileSync(VERSIONS_FILE_PATH, "utf-8");
    const versionsJson = JSON.parse(versionsData);
    versionsJson.baseUrl = TRANSLATIONS_BASE_URL;

    res.json(versionsJson);
  } catch (error) {
    console.error("Error reading versions.json:", error);
    res
      .status(500)
      .json({ error: "Internal server error reading versions data." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    "Serving translation files from:",
    path.join(__dirname, "translations"),
  );
});
