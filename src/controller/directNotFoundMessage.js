exports.directNotFound = (req, res) => {
    // Rendering.
    return res.render('not-found', {
        layout: false
    })
}