const { errorHandling } = require("../errorController")

exports.rootController = async (req, res) => {
    try {
        // Rendering.
        return res.render('home', {
            layout: false,
            rootPage: true
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}