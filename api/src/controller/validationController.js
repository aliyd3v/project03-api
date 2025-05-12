const { matchedData, validationResult } = require("express-validator")
const fs = require('fs')

exports.validationController = (req) => {
    const errors = validationResult(req)
    let error
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg)

        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
    }

    // Returning validation result.
    return { data: matchedData(req), error }
}