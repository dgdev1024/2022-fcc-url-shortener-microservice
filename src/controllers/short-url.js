/**
 * @file controllers/short-url.js
 */

const util = require('util');
const dns = require('dns');
const shortUrlSchema = require('../models/short-url');
const lookup = util.promisify(dns.lookup);

const httpRegex = /^https:\/\//g;

module.exports = {
  async post(req, res) {
    const { original_url } = req.body;

    // The original URL must be HTTPS.
    if (httpRegex.test(original_url) === false) {
      return res.status(400).json({ error: "invalid url" });
    }

    try {
      // Look up the URL to verify it.
      await lookup(original_url.replace(httpRegex, ''));

      // Check to see if a shortened URL has already been generated for this original URL, first. If it does, return it.
      const existingUrl = await shortUrlSchema.findOne({
        originalUrl: original_url
      });
      if (existingUrl) {
        return res.status(200).json({
        original_url: existingUrl.originalUrl,
        short_url: `https://${req.get('host')}/api/shorturl/${existingUrl.shortUrl}`
      })
      }

      // Get the number of short URL documents in the database.
      const urlCount = await shortUrlSchema.countDocuments();

      // Create a new shortened URL.
      const postedUrl = await shortUrlSchema.create({
        originalUrl: original_url,
        shortUrl: urlCount + 1
      });

      // Return the shortened URL as part of the response.
      return res.status(200).json({
        original_url: postedUrl.originalUrl,
        short_url: `https://${req.get('host')}/api/shorturl/${postedUrl.shortUrl}`
      })
    } catch (err) {
      console.error(`POST /api/shorturl: ${err}`);
      if (err.code === 'ENOTFOUND') {
        return res.status(400).json({ error: 'invalid url' });
      } else {
        return res.status(500).json({ error: 'server error' });
      }
    }
  },

  async get(req, res) {
    const { id } = req.params;

    const postedUrl = await shortUrlSchema.findOne({
      shortUrl: parseInt(id)
    });

    if (!postedUrl) {
      return res.status(404).json({ error: "url not found" });
    }

    return res.redirect(postedUrl.originalUrl);
  },
};
