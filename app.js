const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/notesRoutes");

const logger = require("./config/logger");
const requestLogger = require("./middleware/loggerMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

app.use(pinoHttp({ logger }));

app.use(requestLogger);

// Main API Route

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notes API Running",
  });
});

// Authentication Routes

app.use("/api/auth", authRoutes);

// Notes Routes
app.use("/api/notes", noteRoutes);
// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// Global Error Handler
app.use(errorHandler);
module.exports = app;