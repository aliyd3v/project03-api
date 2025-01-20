const { jwtSecretKey } = require("../config/config")
const { errorHandling } = require("../controller/errorController")
const jwt = require("jsonwebtoken")
const { Admin } = require("../model/userModel")
const { idChecking } = require("../controller/idController")

exports.jwtAccessMiddleware = async function (req, res, next) {
    try {
        //Checking token for valid.
        const token = req.cookies.token
        if (!token) {
            // Redirect.
            return res.redirect('/login')
        }
        const { decoded, error } = jwt.verify(token, jwtSecretKey, (error, decoded) => {
            return { decoded, error }
        })
        if (error) {
            // Redirect.
            return res.redirect('/login')
        }
        if (decoded === undefined) {
            // Redirect.
            return res.redirect('/login')
        }
        const { id } = decoded

        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Redirect.
            return res.redirect('/login')
        }
        const admin = await Admin.findById(id)
        if (!admin) {
            // Redirect.
            return res.redirect('/login')
        }

        next()
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}
