/**
 * @file src/index.js
 */

const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const api = require("./routes/api");

// Environment Variables
require("dotenv").config();

// Connect To Database
(async () => {
  console.log("Connecting to database. . .");
  await mongoose.connect(process.env.DATABASE_URL);
})();

// Initialize Application
const app = express();

// Middleware
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());

// GET /
//
// Serves the index page.
app.get("/", (_, res) =>
  res.status(200).sendFile(path.join(__dirname, "pages", "index.html"))
);

// ROUTE /api
//
// API Endpoints
app.use("/api", api);

// Listen For Connections
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port #${port}. . .`);
});
