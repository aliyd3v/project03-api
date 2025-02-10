const { Booking } = require("../model/bookingModel")
const { Admin } = require("../model/userModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")

exports.getAllActiveBooking = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Getting all active bookings.

        // Get yesterday date.
        const today = new Date()
        today.setHours(today.getHours() + 5, 0, 0, 0)
        let yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1)
        const [month, day, year] = yesterday.toLocaleDateString().split('/').map(Number)
        yesterday = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`

        // Getting date great or equal then yesterday.
        let bookings = await Booking.paginate({ is_canceled: false, date: { $gte: yesterday } }, { page: 1, limit: 10, sort: { date: 1 }, populate: 'stol' })

        // Remove older booking from now.
        const now = new Date()
        for (let i = 0; i < bookings.docs.length; i++) {
            let timeEnd = new Date(`${bookings.docs[i].date} ${bookings.docs[i].time}`)
            timeEnd.setHours(timeEnd.getHours() + bookings.docs[i].hour)

            // Remove from bookings.docs array.
            if (timeEnd < now) {
                bookings.docs.splice(i, 1)
                bookings.totalDocs--
            }
        }

        // Rendering.
        return res.render(`${user.language == 'English' ? 'booking' : 'booking_ru'}`, {
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
