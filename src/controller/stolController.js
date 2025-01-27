const { Stol } = require("../model/stolModel")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { validationController } = require("./validationController")

let page = 1
let limit = 10

exports.createStolPage = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('table-create', {
            layout: false,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.createStol = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('table-create', {
                layout: false,
                inputedData: data,
                errorMessage: error,
                user
            })
        }

        // Checking stol-number for exists.
        const condidat = await Stol.findOne({ number: data.number })
        if (condidat) {
            // Rendering.
            return res.render('table-create', {
                layout: false,
                inputedData: data,
                errorMessage: `Already exists stol with number - ${data.number}. Please enter another number!`,
                user
            })
        }

        // Writing to database.
        await Stol.create({
            number: data.number,
            price: data.price,
            capacity: data.capacity
        })

        // Redirecting.
        return res.redirect('/stol')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getAllStols = async (req, res) => {
    const { query: { page } } = req
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Getting all stols from database.
        const stols = await Stol.paginate({}, { page, limit, sort: { number: 1 } })

        // Responding.
        return res.render('table', {
            layout: false,
            stols,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updateOneStolPage = async (req, res) => {
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

        // Geting a stol from database via id.
        const stol = await Stol.findById(id)

        // Checking stol for exists.
        if (!stol) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Rendering.
        return res.render('table-update', {
            layout: false,
            stol,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updateOneStol = async (req, res) => {
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

        // Geting a stol from database via id.
        const stol = await Stol.findById(id)

        // Checking stol for exists.
        if (!stol) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('table-update', {
                layout: false,
                inputedData: data,
                errorMessage: error,
                user
            })
        }

        // Checking for changing data.
        if (stol.number == data.number && stol.price == data.price && stol.capacity == data.capacity) {
            // Redirect.
            return res.redirect('/stol')
        }

        // Writing updates to database.
        stol.number = data.number
        stol.price = data.price
        stol.capacity = data.capacity
        await Stol.findByIdAndUpdate(id, stol)

        // Redirect.
        return res.redirect('/stol')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteOneStol = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Geting a stol from database via id.
        const stol = await Stol.findById(id)

        // Checking stol for exists.
        if (!stol) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Deleting stol from database.
        await Stol.findByIdAndDelete(id)

        // Redirecting.
        return res.redirect('/stol')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}