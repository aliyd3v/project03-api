const jwt = require('jsonwebtoken')
const { validationController } = require('./validationController')
const { errorHandling } = require('./errorController')
const { jwtSecretKey } = require('../config/config')
const { Admin } = require('../model/userModel')
const { scryptVerify } = require('../helper/crypto')
const { idChecking } = require('./idController')

const tokenGenerate = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, jwtSecretKey)
}

exports.loginPage = async (req, res) => {
    try {
        // Checking token.
        const token = req.cookies.token
        if (token) {
            const { decoded, error } = jwt.verify(token, jwtSecretKey, (error, decoded) => {
                return { decoded, error }
            })
            if (error) {
                // Clear cookie token.
                res.clearCookie('token')

                // Rendering.
                return res.render('login', {
                    layout: false
                })
            }
            if (decoded === undefined) {
                // Clear cookie token.
                res.clearCookie('token')

                // Rendering.
                return res.render('login', {
                    layout: false
                })
            }
            const { id } = decoded

            // Checking id to valid.
            const idError = idChecking(req, id)
            if (idError) {
                // Clear cookie token.
                res.clearCookie('token')

                // Rendering.
                return res.render('login', {
                    layout: false
                })
            }
            const admin = await Admin.findById(id)
            if (!admin) {
                // Clear cookie token.
                res.clearCookie('token')

                // Rendering.
                return res.render('login', {
                    layout: false
                })
            }

            // Redirect.
            return res.redirect('/')
        }

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
            // Rendering.
            return res.render('login', {
                layout: false,
                errorMessage: error
            })
        }

        // Checking user for existence.
        const user = await Admin.findOne({ username: data.username })
        if (!user) {
            // Rendering.
            return res.render('login', {
                layout: false,
                username: data.username,
                errorMessage: `Admin not found with username "${data.username}".`
            })
        }

        // Verify password.
        const verify = await scryptVerify(data.password, user.password)

        if (!verify) {
            // Rendering.
            return res.render('login', {
                layout: false,
                username: data.username,
                password: data.password,
                errorMessage: `Password is wrong!`
            })
        }

        // Generating token.
        const token = tokenGenerate(user._id)

        // Write cookies to browser.
        res.cookie('token', token)
        res.cookie('userId', user._id)

        // Redirect.
        return res.redirect('/')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.logout = async (req, res) => {
    try {
        // Clear cookie token.
        res.clearCookie('token')

        // Redirect.
        return res.redirect('/login')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}