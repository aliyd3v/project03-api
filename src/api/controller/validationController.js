const { matchedData, validationResult } = require("express-validator")

exports.validationController = (req) => {
    const errors = validationResult(req)
    let error
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg)
    }

    // Returning validation result.
    return { data: matchedData(req), error }
}