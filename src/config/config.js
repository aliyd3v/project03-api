require('dotenv').config()

exports.port = process.env.PORT || 3000

exports.jwtSecretKey = process.env.JWT_SECRET_KEY

exports.mongodbUrl = process.env.MONGODB_URL