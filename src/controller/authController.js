const jwt = require('jsonwebtoken')
const { validationController } = require('./validationController')
const { errorHandling } = require('./errorController')
const { jwtSecretKey } = require('../config/config')
const { Admin } = require('../model/userModel')
const { scryptVerify } = require('../helper/crypto')

const tokenGenerate = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, jwtSecretKey)
}

exports.loginPage = async (req, res) => {
    try {
        // Rendering.
        return res.render('login', {
            layout: false
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.login = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Checking user for existence.
        const user = await Admin.findOne({ username: data.username })
        if (!user) {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: `Admin not found with username "${data.username}".` }
            })
        }

        // Verify password.
        const verify = await scryptVerify(data.password, user.password)

        if (!verify) {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: `Password is wrong!` }
            })
        }

        // Generating token.
        const token = tokenGenerate(user._id)

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Login success.",
                token
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}