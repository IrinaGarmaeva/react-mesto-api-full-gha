const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 100,
  windowMS: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
