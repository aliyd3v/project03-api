const { Booking } = require("../model/bookingModel")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")

exports.getAllActiveBooking = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Getting all active bookings.

        const now = new Date().toISOString().split('T')[0]
        const bookings = await Booking.paginate({ is_canceled: false, date: { $gte: now } }, { page: 1, limit: 10, sort: { date: -1 }, populate: 'stol' })

        // Rendering.
        return res.render('booking', {
            layout: false,
            bookings,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deactivateBooking = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Geting a booking from database via id and checking for existence.
        const booking = await Booking.findById(id).populate('stol')
        if (!booking) {
            // Rendering.
            return res.render('not-found', { layout: true })
        }

        // Checking status.
        if (booking.is_canceled == true) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Writing changes to database.
        booking.is_canceled = true
        await Booking.findByIdAndUpdate(id, booking)

        // Redirect.
        return res.redirect('/booking')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}
