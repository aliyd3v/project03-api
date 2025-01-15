exports.directNotFound = (req, res) => {
    // // Responding.
    // return res.status(404).send({
    //     success: false,
    //     data: null,
    //     error: { message: "Direct is not found!" }
    // })

    // Rendering.
    return res.render('not-found', {
        layout: false
    })
}