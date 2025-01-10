exports.rootController = async (req, res) => {
    try {
        return res.render('home', {
            layout: false,
            title: 'Home'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            data: null,
            error: { message: "Internal server error!" }
        })
    }
}