const { domain } = require("../../config/config")
const { sendVerifyToEmail } = require("../../helper/sendToMail")
const { Booking } = require("../../model/bookingModel")
const { Stol } = require("../../model/stolModel")
const { TokenStore } = require("../../model/tokenStoreModel")
const { errorHandling } = require("./errorController")
const { generateToken } = require("./tokenController")
const { validationController } = require("./validationController")

exports.createBookingWithVerification = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Checking stol_number and date for booking exists.
        const stol = await Stol.findOne({ number: data.stol_number })
        if (!stol) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: {
                    message: "Stol is not found!"
                }
            })
        }

        // Checking date and time to booking for next time.
        const date_now = new Date().toISOString().split('T')[0]
        if (data.date < date_now) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: "Pleare enter date and time for next time!"
                }
            })
        } else if (data.date >= date_now) {

            // Time now to date format.
            let time_now = new Date().toLocaleTimeString().split(' ')[0]
            const [hours, minutes, secunds] = time_now.split(':')
            time_now = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`

            // Time checking for not older from now.
            if (data.time < time_now) {
                // Responding.
                return res.status(400).send({
                    success: false,
                    data: null,
                    error: {
                        message: "Pleare enter date and time for next time!"
                    }
                })
            }
        }

        // Checking condidats on current date.
        let yesterday = new Date(`${data.date} ${data.time}`)
        yesterday.setHours(yesterday.getHours())
        yesterday.setDate(yesterday.getDate() - 1)
        const [month, day, year] = yesterday.toLocaleDateString().split('/').map(Number)
        yesterday = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
        const existingBookings = await Booking.find({ stol: stol._id, date: { $in: [yesterday, data.date] }, is_canceled: false })
        if (existingBookings) {

            // New time to date format.
            let newT = new Date(`${data.date} ${data.time}`)

            // New end time to date format.
            let newT_end = new Date(newT)
            newT_end.setHours(newT_end.getHours() + Number(data.hour))

            // Itoration existing bookings and check time for non-intersection.
            for (const existData of existingBookings) {

                // Exist time to date format.
                let existT = new Date(`${existData.date} ${existData.time}`)

                // Exist end time to date format.
                let existT_end = new Date(existT)
                existT_end.setHours(existT_end.getHours() + Number(existData.hour))

                // Checking for non-intersection.
                if (newT < existT_end && newT_end > existT) {
                    // Responding.
                    return res.status(400).send({
                        success: false,
                        data: null,
                        error: {
                            message: `Stol is already booked for current time. Please book another stol or another time!`
                        }
                    })
                }
            }
        }

        // Create nonce for once using from token.
        const nonce = crypto.randomUUID()
        await TokenStore.create({ nonce })

        // Order payload.
        const bookingStol = {
            number: data.stol_number,
            date: data.date,
            time: data.time,
            hour: data.hour
        }
        const booking = {
            customer_name: data.customer_name,
            email: data.email,
            phone: data.phone,
            stol: bookingStol,
            nonce
        }

        // Generate token with order for verify token.
        const token = generateToken(booking)
        const verifyUrl = `${domain}/api/verify/email-verification?token=${token}`

        // Sending verify message to customer email.
        sendVerifyToEmail(data.email, verifyUrl)

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Verify URL has been sended to your email."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.checkBookingForAvailability = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Checking data and time to valid.
        let selectedDateTime = new Date(`${data.date} ${data.time}`)
        let now = new Date()
        if (now > selectedDateTime) {
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "Pleare enter date and time for next time!" }
            })
        }
        if (data.hour > 18 || data.hour < 1) {
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "You cannot book a table for longer than 18 hour and short than 1 hour!" }
            })
        }

        // Getting all stols.
        const stols = await Stol.find().sort({ number: 1 })
        const allStolsLength = stols.length
        const availableStols = stols.map(stol => stol.number)

        // Getting bookings from database with requesting date.
        let yesterdayFromSelectedDate = new Date(selectedDateTime)
        yesterdayFromSelectedDate.setDate(yesterdayFromSelectedDate.getDate() - 1)
        const [yesterdayMonth, yesterdayDay, yesterdayYear] = yesterdayFromSelectedDate.toLocaleDateString().split('/').map(Number)
        yesterdayFromSelectedDate = `${yesterdayYear}-${yesterdayMonth < 10 ? `0${yesterdayMonth}` : yesterdayMonth}-${yesterdayDay < 10 ? `0${yesterdayDay}` : yesterdayDay}`

        // Getting bookings with yesterday date from selected date.
        const bookings = await Booking.find({ date: { $in: [yesterdayFromSelectedDate, data.date] }, is_canceled: false }).populate('stol')

        // Checking every booking with requesting time.
        if (bookings) {
            for (const booking of bookings) {
                // Checking existing bookings on current time.
                const existingTimeStart = new Date(`${booking.date} ${booking.time}`)
                let existingTimeEnd = new Date(existingTimeStart)
                existingTimeEnd.setHours(existingTimeEnd.getHours() + booking.hour)
                const requestingTimeStart = new Date(`${data.date} ${data.time}`)
                let requestingTimeEnd = new Date(requestingTimeStart)
                requestingTimeEnd.setHours(requestingTimeEnd.getHours() + Number(data.hour))
                if (requestingTimeStart < existingTimeEnd && requestingTimeEnd > existingTimeStart) {
                    let indexBooking = availableStols.indexOf(booking.stol.number)
                    availableStols.splice(indexBooking, 1)
                }
            }
        }

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Getted availabling stols.",
                date: data.date, time: data.time, hour: data.hour,
                available_stols: availableStols,
                allStolsLength
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}