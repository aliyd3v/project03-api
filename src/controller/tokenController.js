const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../config/config')

exports.generateToken = (payload) => {
    return jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' });
}

exports.verifyToken = (token) => {
    return jwt.verify(token, jwtSecretKey, (error, decoded) => {
        return { data: decoded, error }
    })
}