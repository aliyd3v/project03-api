const { Booking } = require("../model/bookingModel")
const { Order } = require("../model/orderModel")
const { errorHandling } = require("./errorController")

exports.historyPage = (req, res) => {
    try {
        return res.render('history', {
            layout: false,
            historyPage: true
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getAllHistory = async (req, res) => {
    try {
        // Getting all orders with status "Delivered" and deactivated bookings.
        const orders = await Order.find({ status: 'Delivered' }).sort({ createdAt: "desc" })
        const bookings = await Booking.find({ is_active: false }).sort({ date: "desc" })

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "History getted is successful.",
                history: { orders, bookings }
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteAllHistory = async (req, res) => {
    try {
        // Deleting all orders with status "Delivered" and deactivated bookings.
        await Order.deleteMany({ status: 'Delivered' })
        await Booking.deleteMany({ is_active: false })

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: { message: "History have been deleted successfully." }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}