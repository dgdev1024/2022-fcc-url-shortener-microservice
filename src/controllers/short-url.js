/**
 * @file controllers/short-url.js
 */

const uuid = require("uuid");
const shortUrlSchema = require("../models/short-url");
const urlRegex =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

module.exports = {
  async post(req, res) {
    let { original_url, short_url } = req.body;

    if (urlRegex.test(original_url) === false) {
      return res.status(400).json({ error: "invalid url" });
    }

    if (!short_url) {
      short_url = uuid.v4().slice(0, 8);
    }

    const postedUrl = await shortUrlSchema.create({
      originalUrl: original_url,
      shortUrl: short_url,
    });

    return res.status(200).json({
      original_url: postedUrl.originalUrl,
      short_url: `https://${req.get("host")}/api/shorturl/${
        postedUrl.shortUrl
      }`,
    });
  },

  async get(req, res) {
    const { id } = req.params;

    const postedUrl = await shortUrlSchema.findOne({ shortUrl: id });
    if (!postedUrl) {
      return res.status(404).json({ error: "url not found" });
    }

    console.log(postedUrl);
    return res.redirect(postedUrl.originalUrl);
  },
};
