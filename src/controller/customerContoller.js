const { Booking } = require("../model/bookingModel")
const { Order } = require("../model/orderModel")
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