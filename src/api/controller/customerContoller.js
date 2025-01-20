const { Booking } = require("../../model/bookingModel")
const { Order } = require("../../model/orderModel")
const { errorHandling } = require("./errorController")
const { validationController } = require("./validationController")

exports.getOneCustomer = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Getting customer bookings and orders from database by email.
        const bookings = await Booking.find({ email: data.email })
        const orders = await Order.find({ email: data.email })

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: `Getted customer and him bookings and orders with email ${data.email}`,
                customer: { bookings, orders }
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.cancelBookingForCustomer = async (req, res) => {
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

        // Checking booking for existence.
        const booking = await Booking.findOne(id)
        if (!booking) {
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Booking is not found!" }
            })
        }

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Checking customer.
        if (data.email != booking.email) {
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "Access denied!" }
            })
        }

        // Writing changes to database.
        booking.is_active = false
        await Booking.findByIdAndUpdate(id, booking)

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: { message: "Booking has been deactivated." }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}