exports.errorHandling = (error, res) => {
    console.log(error)
    // Responding.
    return res.status(500).render('500', {
        layout: false
    })
}