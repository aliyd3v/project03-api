const { Stol } = require("../../model/stolModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")

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