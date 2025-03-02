const { duration } = require("moment");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const opt = {
    duration: 1,
    points: 60,
    blockDuration: 300
}

exports.rateLimiter = new RateLimiterMemory(opt)