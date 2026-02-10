const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  // Download Chrome (default `skipDownload: false`).
  chrome: {
    skipDownload: false,
  },
  // Download Firefox (default `skipDownload: true`).
  firefox: {
    skipDownload: false,
  },
};
