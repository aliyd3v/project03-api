const { TokenStore } = require('../model/tokenStoreModel')
const { Order } = require('../model/orderModel')
const { succesMsgToHtml } = require('../helper/successMsgToHtml')
const { sendingOrderToTgChannel } = require('../helper/sendingOrderToTgChannel')
const { gettingMealsFromOrder } = require('../helper/gettingMealsFromOrder')
const { Booking } = require('../model/bookingModel')
const { sendingBookingToTgChannel } = require('../helper/sendingBookingToTgChannel')
const { errorHandling } = require('./errorController')
const { Stol } = require('../model/stolModel')
const { verifyFailedHtml } = require('../helper/verifyFailedHtml')
const { generateToken, verifyToken } = require('./tokenController')
const { validationController } = require('./validationController')
const { domain } = require('../config/config')
const { sendVerifyToEmail } = require('../helper/sendToMail')

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
            return res.status(400).send(verifyFailedHtml)
        }

        // Checking token for valid.
        const { error, data } = verifyToken(token)
        if (error) {
            // Responding.
            return res.status(400).send(verifyFailedHtml)
        }
        if (!data.nonce) {
            // Responding.
            return res.status(400).send(verifyFailedHtml)
        }
        const nonce = await TokenStore.findOne({ nonce: data.nonce })
        if (!nonce) {
            // Responding.
            return res.status(400).send(verifyFailedHtml)
        }

        // Writing to database 

        // For order.
        if (data.meals) {
            const newOrder = await Order.create({
                customer_name: data.customer_name,
                phone: data.phone,
                email: data.email,
                meals: data.meals,
                status: "Wait accept"
            })

            // Deleting nonce from database for once using from token.
            await TokenStore.findByIdAndDelete(nonce._id)

            // Getting meals from order.
            const meals = await gettingMealsFromOrder(data.meals)

            // Sending order to telegram channel.
            const selectedPieceFromOrder = {
                id: newOrder._id,
                customer_name: data.customer_name,
                phone: data.phone,
                email: data.email,
                meals,
                status: "Wait accept",
                createdAt: newOrder.createdAt
            }
            sendingOrderToTgChannel(selectedPieceFromOrder)

            // Create success message to customer.
            const html = succesMsgToHtml(data.customer_name, 'Order')

            // Responding with html.
            return res.status(200).send(html)
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
                time_start: data.stol.time_start,
                time_end: data.stol.time_end,
                is_active: true
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

            // Create success message to customer.
            const html = succesMsgToHtml(data.customer_name, 'Booking')

            // Responding with html.
            return res.status(200).send(html)
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