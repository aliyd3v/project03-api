const { errorHandling } = require("./errorController")

exports.rootController = (req, res) => {
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