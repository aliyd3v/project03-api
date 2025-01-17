const { jwtSecretKey } = require("../config/config")
const { errorHandling } = require("../controller/errorController")
const jwt = require("jsonwebtoken")
const { Admin } = require("../model/userModel")
const { idChecking } = require("../controller/idController")

exports.SUjwtAccessMiddleware = async function (req, res, next) {
    try {
        // Checking header authorization.
        const authHeader = req.headers.authorization
        if (!authHeader) {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: "Access denied. Invalid token!" }
            })
        }

        //Checking token for valid.
        const token = authHeader.split(' ')[1]
        if (!token) {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: "Access denied. Invalid token!" }
            })
        }
        const { decoded, error } = jwt.verify(token, jwtSecretKey, (error, decoded) => {
            return { decoded, error }
        })
        if (error) {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: "Access denied. Invalid token!" }
            })
        }
        if (decoded === undefined) {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: "Access denied. Invalid token!" }
            })
        }
        const { id } = decoded

        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }
        const admin = await Admin.findById(id)
        if (!admin) {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: "Access denied. Invalid token!" }
            })
        }
        if (admin.role !== 'SUPERUSER') {
            // Responding.
            return res.status(403).send({
                success: false,
                data: null,
                error: { message: "Access denied. Invalid token!" }
            })
        }

        next()
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}
