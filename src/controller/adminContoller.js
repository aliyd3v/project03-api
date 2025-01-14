const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { validationController } = require("./validationController")

exports.adminCreate = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        const condidat = await Admin.findOne({ username: data.username })
        if (condidat) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: `Already used this name from another admin. Please enter another username!`
                }
            })
        }

        // Writing new admin to database.
        await Admin.create({ username: data.username, password: data.password })

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: `Admin has been created successful.`
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find()
        return res.status(201).send({
            success: true,
            error: false,
            data: { admins }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}