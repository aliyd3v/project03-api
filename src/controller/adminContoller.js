const { salt } = require("../config/config")
const { scryptHash } = require("../helper/crypto")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { validationController } = require("./validationController")

exports.adminsPage = (req, res) => {
    try {
        return res.render('admin', {
            layout: false,
            adminsPage: true
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

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

        // Checking for existence admin with currend username.
        const condidat = await Admin.findOne({ username: data.username })
        if (condidat) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: `'${data.username}' already used. Please, enter another username!`
                }
            })
        }

        // Hashing password.
        const passwordHash = await scryptHash(data.password, salt)

        // Writing new admin to database.
        await Admin.create({ username: data.username, password: passwordHash })

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

exports.deleteOneAdmin = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking admin for existence.
        const admin = await Admin.findById(id)
        if (!admin) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: `Admin is not found!` }
            })
        }

        // Checking for existence another admin for controlling.
        const admins = await Admin.find()
        if (admins.length < 2) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: `You can't delete latest admin!` }
            })
        }

        // Deleting admin from database.
        await Admin.findByIdAndDelete(id)

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: { message: "Admin has been deleted successfully." }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}