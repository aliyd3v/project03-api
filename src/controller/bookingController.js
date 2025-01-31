const { Booking } = require("../model/bookingModel")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")

exports.getAllActiveBooking = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Getting all active bookings.
        const bookings = await Booking.paginate({ is_canceled: false }, { page: 1, limit: 10, sort: { date: -1 }, populate: 'stol' })

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
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Geting a booking from database via id and checking for existence.
        const booking = await Booking.findById(id).populate('stol')
        if (!booking) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: {
                    message: "Booking is not found!"
                }
            })
        }

        // Writing changes to database.
        booking.is_active = false
        await Booking.findByIdAndUpdate(id, booking)

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: { message: "Booking has been deactivated successfully." }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}
