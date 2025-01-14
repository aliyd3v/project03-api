const { Stol } = require("../model/stolModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { validationController } = require("./validationController")

exports.createStol = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Checking stol-number for exists.
        const condidat = await Stol.findOne({ number: data.number })
        if (condidat) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: `Already exists stol with number - ${data.number}. Please enter another number!`
                }
            })
        }

        // Writing to database.
        await Stol.create({
            number: data.number,
            price: data.price
        })

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Stol has been created successfully."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getAllStols = async (req, res) => {
    try {
        // Getting all stols from database.
        const stols = await Stol.find()

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Stols getted successfully.",
                stols
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getOneStol = async (req, res) => {
    const { params: { id } } = req
    try {
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

        // Geting a stol from database via id.
        const stol = await Stol.findById(id)

        // Checking stol for exists.
        if (!stol) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: {
                    message: "Stol is not found!"
                }
            })
        }

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Stol getted successfully.",
                stol
            }
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

        // Geting a stol from database via id.
        const stol = await Stol.findById(id)

        // Checking stol for exists.
        if (!stol) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: {
                    message: "Stol is not found!"
                }
            })
        }

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

        // Checking for changing data.
        if (stol.number == data.number && stol.price == data.price) {
            // Responding.
            return res.status(201).send({
                success: true,
                error: false,
                data: {
                    message: "Stol has been updated successfully."
                }
            })
        }

        // Writing updates to database.
        stol.number = data.number
        stol.price = data.price
        await Stol.findByIdAndUpdate(id, stol)

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Stol has been updated successfully."
            }
        })
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
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Geting a stol from database via id.
        const stol = await Stol.findById(id)

        // Checking stol for exists.
        if (!stol) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: {
                    message: "Stol is not found!"
                }
            })
        }

        // Deleting stol from database.
        await Stol.findByIdAndDelete(id)

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Stol has been deleted successfully."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.createManyStols = async (req, res) => {
    const { body } = req
    try {
        const { begin, amount, price } = body
        if (!begin || !amount || !price) {
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "Amount, price and begin is required!" }
            })
        }

        await new Promise(async (resolve, reject) => {
            for (let i = begin; i <= amount; i++) {
                await Stol.create({
                    number: i,
                    price: price
                })
            }
            resolve()
        })

        return res.status(201).send({
            success: true,
            error: false,
            data: { message: "Create many successfully" }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteManyStols = async (req, res) => {
    try {
        await Stol.deleteMany()

        return res.status(201).send({
            success: true,
            error: false,
            data: { message: "Delete all stols successfully." }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}