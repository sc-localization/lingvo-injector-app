// server.js
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

const VERSIONS_FILE_PATH = path.join(__dirname, "versions", "versions.json");
const TRANSLATIONS_DIR = path.join(__dirname, "translations");
const TRANSLATIONS_BASE_URL = `http://localhost:${port}/translations`;

// Helper to get available languages for a version
const getAvailableLanguages = (version) => {
  const versionPath = path.join(TRANSLATIONS_DIR, version);
  if (!fs.existsSync(versionPath) || !fs.statSync(versionPath).isDirectory()) {
    return [];
  }

  return fs
    .readdirSync(versionPath)
    .filter((file) => fs.statSync(path.join(versionPath, file)).isDirectory());
};

// Middleware
app.use(cors());
app.use("/translations", express.static(TRANSLATIONS_DIR));

app.get("/versions/versions.json", (req, res) => {
  try {
    if (!fs.existsSync(VERSIONS_FILE_PATH)) {
      return res.status(404).json({ error: "versions.json not found" });
    }

    const versionsData = fs.readFileSync(VERSIONS_FILE_PATH, "utf-8");
    const versionsJson = JSON.parse(versionsData);

    // Add available languages for each version
    Object.keys(versionsJson).forEach((channel) => {
      versionsJson[channel].languages = getAvailableLanguages(channel);
    });

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
