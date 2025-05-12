exports.badRequest = (req, res) => {
    // Rendering.
    return res.render('bad-request', {
        layout: false
    })
}