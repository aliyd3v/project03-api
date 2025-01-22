const { jwtSecretKey } = require("../config/config")
const { errorHandling } = require("../controller/errorController")
const jwt = require("jsonwebtoken")
const { Admin } = require("../model/userModel")
const { idChecking } = require("../controller/idController")

exports.SUjwtAccessMiddleware = async function (req, res, next) {
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
            // Clear token cookie.
            res.clearCookie('token')
            // Redirect.
            return res.redirect('/login')
        }
        if (decoded === undefined) {
            // Clear token cookie.
            res.clearCookie('token')
            // Redirect.
            return res.redirect('/login')
        }
        const { id } = decoded

        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Clear token cookie.
            res.clearCookie('token')
            // Redirect.
            return res.redirect('/login')
        }
        const admin = await Admin.findById(id)
        if (!admin) {
            // Clear token cookie.
            res.clearCookie('token')
            // Redirect.
            return res.redirect('/login')
        }

        // Checking userId cookie.
        const userIdCookie = req.cookies.userId
        if (id != userIdCookie || !userIdCookie) {
            // Clear token cookie.
            res.clearCookie('token')
            // Redirect.
            return res.redirect('/login')
        }

        // Checking role.
        if (admin.role !== 'SUPERUSER') {
            // Rendering.
            return res.render('bad-request', {layout: false})
        }

        next()
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}
