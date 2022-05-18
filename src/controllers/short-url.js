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
    const { url } = req.body;
    console.log(req.body);

    try {
      // Create a new URL object with the submitted URL.
      const urlObject = new URL(url);
      
      // Look up the URL to verify it.
      await lookup(urlObject.hostname);

      // Check to see if a shortened URL has already been generated for this original URL, first. If it does, return it.
      const existingUrl = await shortUrlSchema.findOne({
        originalUrl: url
      });
      if (existingUrl) {
        return res.status(200).json({
        original_url: existingUrl.originalUrl,
        short_url: existingUrl.shortUrl,
        short_url_full: `https://${req.get('host')}/api/shorturl/${existingUrl.shortUrl}`
      })
      }

      // Get the number of short URL documents in the database.
      const urlCount = await shortUrlSchema.countDocuments();

      // Create a new shortened URL.
      const postedUrl = await shortUrlSchema.create({
        originalUrl: url,
        shortUrl: urlCount + 1
      });

      // Return the shortened URL as part of the response.
      return res.status(200).json({
        original_url: postedUrl.originalUrl,
        short_url: postedUrl.shortUrl,
        short_url_full: `https://${req.get('host')}/api/shorturl/${postedUrl.shortUrl}`
      })
    } catch (err) {
      console.error(`POST /api/shorturl: ${err}`);
      if (err.code === 'ENOTFOUND') {
        return res.json({ error: 'invalid url' });
      } else {
        return res.status(500).json({ error: 'server error' });
      }
    }
  },

  async get(req, res) {
    const { short_url } = req.params;

    console.log(req.params, req.query)

    try {
      const parsedId = parseInt(short_url);
      if (Number.isNaN(parsedId)) {
        return res.json({ error: "invalid url" });
      }
      
      const postedUrl = await shortUrlSchema.findOne({
        shortUrl: parsedId
      });
  
      if (!postedUrl) {
        return res.status(404).json({ error: "url not found" });
      }
  
      return res.redirect(postedUrl.originalUrl);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "server error" });
    }
  },
};
