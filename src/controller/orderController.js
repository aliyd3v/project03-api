const { Order } = require("../model/orderModel")
const { errorHandling } = require("./errorController")
const { domain } = require('../config/config')
const { validationController } = require("./validationController")
const { sendVerifyToEmail } = require("../helper/sendToMail")
const { TokenStore } = require("../model/tokenStoreModel")
const { generateToken } = require("./tokenController")
const { idChecking } = require("./idController")
const { Admin } = require('../model/userModel')

let limit = 3
let page

exports.orderPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : page = 1

        // Get orders.
        const orders = await Order.paginate(
            { status: { $ne: "Delivered" } },
            { page, limit, sort: { createdAt: -1 } }
        )
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' })
        const cookingOrders = await Order.find({ status: 'Cooking' })
        const onWayOrders = await Order.find({ status: 'On way' })

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order', {
            layout: false,
            isAll: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.waitAcceptOrderPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : page = 1

        // Get orders.
        const orders = await Order.find({ status: { $ne: "Delivered" } })
        const waitAcceptOrders = await Order.paginate(
            { status: "Wait accept" },
            { page, limit, sort: { createdAt: -1 } }
        )
        const cookingOrders = await Order.find({ status: 'Cooking' })
        const onWayOrders = await Order.find({ status: 'On way' })

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order', {
            layout: false,
            isWaitAccept: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.cookingOrderPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : page = 1

        // Get orders.
        const orders = await Order.find({ status: { $ne: "Delivered" } })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' })
        const cookingOrders = await Order.paginate(
            { status: "Cooking" },
            { page, limit, sort: { createdAt: -1 } }
        )
        const onWayOrders = await Order.find({ status: 'On way' })

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order', {
            layout: false,
            isCooking: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.onWayOrderPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : page = 1

        // Get orders.
        const orders = await Order.find({ status: { $ne: "Delivered" } })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' })
        const cookingOrders = await Order.find({ status: 'Cooking' })
        const onWayOrders = await Order.paginate(
            { status: "On way" },
            { page, limit, sort: { createdAt: -1 } }
        )

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order', {
            layout: false,
            isOnWay: true,
            orders,
            waitAcceptOrders,
            cookingOrders,
            onWayOrders,
            user
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

exports.changingStatus = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Getting an order from database by id.
        let order = await Order.findById(id)

        // Checking order for exists.
        if (!order) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Writing update to database.
        if (order.status == 'Wait accept') {
            order.status = 'Cooking'
        } else if (order.status == 'Cooking') {
            order.status = 'On way'
        } else if (order.status == 'On way') {
            order.status = 'Delivered'
        } else {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }
        await Order.findByIdAndUpdate(id, order)

        // Redirect.
        return res.redirect('/order')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}