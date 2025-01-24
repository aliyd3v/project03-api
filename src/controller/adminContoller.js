const { salt } = require("../config/config")
const { scryptHash } = require("../helper/crypto")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { validationController } = require("./validationController")

exports.adminsPage = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Get all admins from database.
        const admins = await Admin.find()
        // Rendering.
        return res.render('admin', {
            layout: false,
            user,
            admins
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.adminCreatePage = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('admin-create', {
            layout: false,
            user
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

exports.updateOneAdmin = async (req, res) => {
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
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Checking admin role.
        if (admin.role == 'SUPERUSER') {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Deleting admin from database.
        await Admin.findByIdAndUpdate(id, admin)

        // Redirect.
        return res.redirect('/admin')
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
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Checking admin role.
        if (admin.role == 'SUPERUSER') {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Deleting admin from database.
        await Admin.findByIdAndDelete(id)

        // Redirect.
        return res.redirect('/admin')
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
        const user = profile

        // Rendering.
        return res.render('profile', {
            layout: false,
            userId: id,
            profile,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}