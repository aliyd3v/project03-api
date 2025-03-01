const { TokenStore } = require('../../model/tokenStoreModel')
const { Order } = require('../../model/orderModel')
const { sendingOrderToTgChannel } = require('../../helper/sendingOrderToTgChannel')
const { Booking } = require('../../model/bookingModel')
const { sendingBookingToTgChannel } = require('../../helper/sendingBookingToTgChannel')
const { errorHandling } = require('./errorController')
const { Stol } = require('../../model/stolModel')
const { generateToken, verifyToken } = require('./tokenController')
const { validationController } = require('./validationController')
const { domain } = require('../../config/config')
const { sendVerifyToEmail } = require('../../helper/sendToMail')
const { Meal } = require('../../model/mealModel')

exports.createVerifyForGetAllBookingAndOrder = async (req, res) => {
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

        // Create nonce for once using from token.
        const nonce = crypto.randomUUID()
        await TokenStore.create({ nonce })

        // Payload for token.
        const payload = {
            email: data.email, nonce
        }

        // Generate token with bookings and orders for verify token.
        const token = generateToken(payload)
        const verifyUrl = `${domain}/verify/email-verification?token=${token}`

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

exports.verifyTokenAndCreateOrderOrBooking = async (req, res) => {
    const { params: { id }, query: { token } } = req
    try {
        // Checking id and token.
        if (id != 'email-verification' || !token) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "Invalid URL!" }
            })
        }

        // Checking token for valid.
        const { error, data } = verifyToken(token)
        if (error) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "Invalid token!" }
            })
        }
        if (!data.nonce) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "Invalid token!" }
            })
        }
        const nonce = await TokenStore.findOne({ nonce: data.nonce })
        if (!nonce) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: "Verify URL is already used!" }
            })
        }

        // Writing to database 

        // For order.
        if (data.meals) {
            const meals = await Promise.all(
                data.meals.map(async (element) => {
                    const meal = await Meal.findById(element.mealId)
                    return {
                        meal,
                        amount: element.amount,
                    }
                })
            )
            const order = {
                customer_name: data.customer_name,
                phone: data.phone,
                email: data.email,
                meals,
                status: "Wait accept"
            }
            const newOrder = await Order.create(order)

            // Deleting nonce from database for once using from token.
            await TokenStore.findByIdAndDelete(nonce._id)

            // Sending order to telegram channel.
            const selectedPieceFromOrder = {
                id: newOrder._id,
                ...order,
                createdAt: newOrder.createdAt
            }
            sendingOrderToTgChannel(selectedPieceFromOrder)

            // Responding with html.
            return res.status(200).send({
                success: true,
                error: false,
                data: {
                    message: "Order is successfully created.",
                    order: newOrder
                }
            })
        }

        // For booking.
        else if (data.stol) {
            const stol = await Stol.findOne({ number: data.stol.number })

            const newBooking = await Booking.create({
                customer_name: data.customer_name,
                email: data.email,
                phone: data.phone,
                stol: stol._id,
                date: data.stol.date,
                time: data.stol.time,
                hour: data.stol.hour,
                is_canceled: false
            })

            // Deleting nonce from database for once using from token.
            await TokenStore.findByIdAndDelete(nonce._id)

            // Sending order to telegram channel.
            const selectedPieceFromBooking = {
                id: newBooking._id,
                customer_name: data.customer_name,
                phone: data.phone,
                email: data.email,
                stol: data.stol,
                status: "Active",
                date: data.date,
                createdAt: newBooking.createdAt
            }
            sendingBookingToTgChannel(selectedPieceFromBooking)

            // Responding with html.
            return res.status(200).send({
                success: true,
                error: false,
                data: {
                    message: "Booking is successfully created.",
                    booking: newBooking
                }
            })
        }

        // Getting bookings and orders for customer-cabinet.
        else if (!data.meals && !data.stol) {
            const { email } = data

            const orders = await Order.find({ email: email }).populate('meals')
            const bookings = await Booking.find({ email: email }).populate('stol')

            // Responding.
            return res.status(200).send({
                success: true,
                error: false,
                data: {
                    message: "Orders and bookings have been getted successfully.",
                    orders,
                    bookings
                }
            })
        }
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}