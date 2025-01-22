const { Order } = require("../model/orderModel")
const { errorHandling } = require("./errorController")
const { domain } = require('../config/config')
const { validationController } = require("./validationController")
const { sendVerifyToEmail } = require("../helper/sendToMail")
const { TokenStore } = require("../model/tokenStoreModel")
const { generateToken } = require("./tokenController")

exports.orderPage = async (req, res) => {
    try {
        // Get orders.
        const orders = await Order.find().populate({ path: 'meals.mealId' })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' }).populate({ path: 'meals.mealId' })
        const cookingOrders = await Order.find({ status: 'Cooking' }).populate({ path: 'meals.mealId' })
        const onWayOrders = await Order.find({ status: 'On way' }).populate({ path: 'meals.mealId' })

        // Rendering.
        return res.render('order', {
            layout: false,
            isAll: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.waitAcceptOrderPage = async (req, res) => {
    try {
        // Get orders.
        const orders = await Order.find().populate({ path: 'meals.mealId' })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' }).populate({ path: 'meals.mealId' })
        const cookingOrders = await Order.find({ status: 'Cooking' }).populate({ path: 'meals.mealId' })
        const onWayOrders = await Order.find({ status: 'On way' }).populate({ path: 'meals.mealId' })

        // Rendering.
        return res.render('order', {
            layout: false,
            isWaitAccept: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.cookingOrderPage = async (req, res) => {
    try {
        // Get orders.
        const orders = await Order.find().populate({ path: 'meals.mealId' })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' }).populate({ path: 'meals.mealId' })
        const cookingOrders = await Order.find({ status: 'Cooking' }).populate({ path: 'meals.mealId' })
        const onWayOrders = await Order.find({ status: 'On way' }).populate({ path: 'meals.mealId' })

        // Rendering.
        return res.render('order', {
            layout: false,
            isCooking: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.onWayOrderPage = async (req, res) => {
    try {
        // Get orders.
        const orders = await Order.find().populate({ path: 'meals.mealId' })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' }).populate({ path: 'meals.mealId' })
        const cookingOrders = await Order.find({ status: 'Cooking' }).populate({ path: 'meals.mealId' })
        const onWayOrders = await Order.find({ status: 'On way' }).populate({ path: 'meals.mealId' })

        // Rendering.
        return res.render('order', {
            layout: false,
            isOnWay: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.createOrderWithVerification = async (req, res) => {
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

        // Order payload.
        const order = {
            customer_name: data.customer_name,
            email: data.email,
            phone: data.phone,
            meals: data.meals,
            nonce
        }

        // Generate token with order for verify token.
        const token = generateToken(order)
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

exports.markAsDelivered = async (req, res) => {
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

        // Getting an order from database by id.
        let order = await Order.findById(id)

        // Checking order for exists.
        if (!order) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: {
                    message: "Order is not found!"
                }
            })
        }

        // Writing update to database.
        order.status = 'Delivered'
        await Order.findByIdAndUpdate(id, order)

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: { message: "Order status has been updated successfully." }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}