const { errorHandling } = require("./errorController")
const { Admin } = require('../model/userModel')

exports.rootController = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('home', {
            layout: false,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}