/**
 * @file models/short-url.js
 */

const { Schema, model } = require("mongoose");

const shortUrlSchema = new Schema({
  originalUrl: String,
  shortUrl: String,
});

module.exports = model("ShortUrl", shortUrlSchema);
