const req = require('require-esm-in-cjs');
module.exports = req(`${__dirname}/eleventy.config.mjs`);
