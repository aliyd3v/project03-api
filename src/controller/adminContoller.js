const { salt } = require("../config/config")
const { scryptHash } = require("../helper/crypto")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { uploadImage, getImageUrl } = require("./imageConroller")
const { validationController } = require("./validationController")
const fs = require('fs')

let page = 1
let limit = 10

exports.adminsPage = async (req, res) => {
    const { query } = req
    try {
        if (query.page) page = query.page

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Get all admins from database.
        const admins = await Admin.paginate({}, { page, limit, sort: { username: 1 } })

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
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('admin-create', {
                layout: false,
                inputedData: data,
                errorMessage: error,
                user
            })
        }

        // Registration path and name of file.
        const filePath = req.file.path
        const fileName = req.file.filename

        // Checking for existence admin with currend username.
        const condidat = await Admin.findOne({ username: data.username })
        if (condidat) {
            // Rendering.
            fs.unlinkSync(filePath)
            return res.render('admin-create', {
                layout: false,
                inputedData: data,
                errorMessage: `'${data.username}' already used. Please, enter another username!`,
                user
            })
        }

        // Uploading image to supabse storage and get image url.
        const { errorSupabase } = await uploadImage(fileName, filePath)
        if (errorSupabase) {
            fs.unlinkSync(filePath)
            // Responding.
            return res.render('admin-create', {
                layout: false,
                inputed: data,
                errorMessage: 'Error uploading image! Please try again later.',
                user
            })
        }
        const { publicUrl } = await getImageUrl(fileName, filePath)
        fs.unlinkSync(filePath)

        // Hashing password.
        const passwordHash = await scryptHash(data.password, salt)

        // Writing new admin to database.
        await Admin.create({
            name: data.name,
            username: data.username,
            password: passwordHash,
            email: data.email,
            phone: data.phone,
            image_url: publicUrl,
            image_name: fileName,
            language: data.language,
            role: "ADMIN"
        })

        // Redirect.
        return res.redirect('/admin')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updateAdminPage = async (req, res) => {
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

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('admin-update', {
            layout: false,
            admin,
            user
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
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

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

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('admin-update', {
                layout: false,
                inputedData: data,
                errorMessage: error,
                admin,
                user
            })
        }

        // Checking inputs.
        if (req.file) {
            // Registration path and name of file.
            const filePath = req.file.path
            const fileName = req.file.filename

            // Checking for existence admin with currend username.
            const condidat = await Admin.findOne({ username: data.username })
            if (condidat._id != admin._id) {
                // Rendering.
                fs.unlinkSync(filePath)
                return res.render('admin-update', {
                    layout: false,
                    inputedData: data,
                    errorMessage: `'${data.username}' already used. Please, enter another username!`,
                    admin,
                    user
                })
            }

            // Uploading image to supabse storage and get image url.
            const { errorSupabase } = await uploadImage(fileName, filePath)
            if (errorSupabase) {
                fs.unlinkSync(filePath)
                // Responding.
                return res.render('admin-update', {
                    layout: false,
                    inputed: data,
                    errorMessage: 'Error uploading image! Please try again later.',
                    admin,
                    user
                })
            }
            const { publicUrl } = await getImageUrl(fileName, filePath)

            // Write changes.
            admin.name = data.name
            admin.username = data.username
            admin.email = data.email
            admin.phone = data.phone
            admin.image_url = publicUrl
            admin.image_name = fileName

            fs.unlinkSync(filePath)
        } else {
            if (data.name == admin.name && data.username == admin.username && data.email == admin.email && data.phone == admin.phone) {
                // Redirect.
                return res.redirect('/admin')
            } else {
                // Checking for existence admin with currend username.
                const condidat = await Admin.findOne({ username: data.username })
                if (condidat._id != admin._id) {
                    // Rendering.
                    return res.render('admin-update', {
                        layout: false,
                        inputedData: data,
                        errorMessage: `'${data.username}' already used. Please, enter another username!`,
                        admin,
                        user
                    })
                }

                // Write changes.
                admin.name = data.name
                admin.username = data.username
                admin.email = data.email
                admin.phone = data.phone
            }
        }

        // Updating admin from database.
        await Admin.findByIdAndUpdate(id, admin)

        // Redirect.
        return res.redirect('/admin')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updatePasswordAdminPage = async (req, res) => {
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

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('admin-password-update', {
            layout: false,
            admin,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updatePasswordAdmin = async (req, res) => {
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

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('admin-create', {
                layout: false,
                inputedData: data,
                errorMessage: error,
                admin,
                user
            })
        }

        // Hashing password.
        const passwordHash = await scryptHash(data.password, salt)

        // Writing changes to database.
        admin.password = passwordHash
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
        return res.render(`${user.language == 'English' ? 'profile' : 'profile_ru'}`, {
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

exports.profileLanguageUpdate = async (req, res) => {
    const { params: { id }, body: { language } } = req
    try {
        // Getting userId from cookies.
        const cookieUserId = req.cookies.userId
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Checking userId from cookie and params id.
        if (id != cookieUserId) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Checking user (admin) for existence.
        const user = await Admin.findById(id)
        if (!user) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Checking language to valid and update user.
        if (!language) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        } else if (language == 'English') {
            user.language = 'English'
        } else if (language == 'Русский') {
            user.language = 'Русский'
        } else {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Writing updates to database.
        await Admin.findByIdAndUpdate(id, user)

        // Redirect.
        return res.redirect('/profile')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}