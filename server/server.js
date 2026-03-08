// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import pino from "pino";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = express();
const port = process.env.PORT || 3001;

const VERSIONS_FILE_PATH = path.join(__dirname, "versions", "versions.json");
const TRANSLATIONS_DIR = path.join(__dirname, "translations");

// Allowed game versions (directory names)
const ALLOWED_VERSIONS = new Set(["LIVE", "PTU", "HOTFIX"]);

// Validate that a path component is safe (alphanumeric, hyphens, underscores, dots)
function isSafePathSegment(segment) {
  return /^[a-zA-Z0-9_.-]+$/.test(segment);
}

// Middleware
app.use(helmet());

app.use(
  pinoHttp({
    logger,
    quietReqLogger: true,
    quietResLogger: false,
  }),
);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : null;

app.use(
  cors(
    allowedOrigins
      ? { origin: allowedOrigins, methods: ["GET", "HEAD"] }
      : undefined,
  ),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  }),
);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Versions endpoint
app.get("/versions/versions.json", (req, res) => {
  try {
    if (!fs.existsSync(VERSIONS_FILE_PATH)) {
      return res.status(404).json({ error: "versions.json not found" });
    }

    const versionsData = fs.readFileSync(VERSIONS_FILE_PATH, "utf-8");
    const versionsJson = JSON.parse(versionsData);

    const baseUrl =
      process.env.BASE_URL ||
      `${req.protocol}://${req.get("host")}/translations`;
    versionsJson.baseUrl = baseUrl;

    res.json(versionsJson);
  } catch (error) {
    req.log.error(error, "Error reading versions.json");
    res
      .status(500)
      .json({ error: "Internal server error reading versions data." });
  }
});

// Translations endpoint with path validation (replaces express.static)
app.get("/translations/:version/:lang/global.ini", (req, res) => {
  const { version, lang } = req.params;

  if (!ALLOWED_VERSIONS.has(version)) {
    return res.status(400).json({ error: "Invalid version." });
  }

  if (!isSafePathSegment(lang)) {
    return res.status(400).json({ error: "Invalid language." });
  }

  const filePath = path.join(TRANSLATIONS_DIR, version, lang, "global.ini");

  // Ensure resolved path is within TRANSLATIONS_DIR
  if (!filePath.startsWith(TRANSLATIONS_DIR + path.sep)) {
    return res.status(400).json({ error: "Invalid path." });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Translation file not found." });
  }

  res.type("text/plain; charset=utf-8").sendFile(filePath);
});

// 404 for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  logger.error(err, "Unhandled error");
  res.status(500).json({ error: "Internal server error." });
});

// Start server with graceful shutdown
const server = app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
  logger.info(`Serving translations from: ${TRANSLATIONS_DIR}`);
});

function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
  // Force close after 10s
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
