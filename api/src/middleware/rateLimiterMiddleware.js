const { rateLimiter } = require("../helper/rateLimiter")

exports.rateLimiterMiddleware = async (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(error => {
            return res.status(429).send({
                success: false,
                data: null,
                error: { message: "Too many request!" }
            })
        })
}