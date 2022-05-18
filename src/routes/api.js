/**
 * @file routes/api.js
 */

const { Router } = require("express");
const ShortUrl = require("../controllers/short-url");

// Create Router
const router = Router();

// POST /shorturl
//
// Creates a short URL bound to the destination URL given in the request body.
router.post("/shorturl", ShortUrl.post);

// GET /shorturl
//
// If a valid short URL is given, redirects the user to the destination URL to
// which the short URL is bound.
router.get("/shorturl/:short_url", ShortUrl.get);

module.exports = router;
