const { salt } = require("../config/config")
const { scryptHash } = require("../helper/crypto")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { validationController } = require("./validationController")

exports.adminsPage = async (req, res) => {
    try {
        // Get all admins from database.
        const admins = await Admin.find()
        // Rendering.
        return res.render('admin', {
            layout: false,
            admins: admins
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
        await Admin.create({
            username: data.username,
            password: passwordHash,
            email: data.email,
            phone: data.phone,
            role: "ADMIN"
        })

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
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

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

        // Checking admin role.
        if (admin.role == 'SUPERUSER') {
            // Responding.
            return res.status(400).send({
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

exports.profilePage = async (req, res) => {
    try {
        // Getting userId from cookies.
        const id = req.cookies.userId
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Find profile from database.
        const profile = await Admin.findById(id)
        if (!profile) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Rendering.
        return res.render('profile', {
            layout: false,
            userId: id,
            profile
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}