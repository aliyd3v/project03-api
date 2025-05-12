const { Order } = require("../model/orderModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { Admin } = require('../model/userModel')

let limit = 3
let page = 1

exports.orderPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : page = 1

        // Get orders.
        const orders = await Order.paginate(
            { status: { $nin: ['Delivered', 'Dismissed'] } },
            { page, limit, sort: { createdAt: -1 } }
        )
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' })
        const cookingOrders = await Order.find({ status: 'Cooking' })
        const onWayOrders = await Order.find({ status: 'On way' })

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render(`${user.language == 'English' ? 'order' : 'order_ru'}`, {
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
        const orders = await Order.find({ status: { $nin: ['Delivered', 'Dismissed'] } })
        const waitAcceptOrders = await Order.paginate(
            { status: "Wait accept" },
            { page, limit, sort: { createdAt: -1 } }
        )
        const cookingOrders = await Order.find({ status: 'Cooking' })
        const onWayOrders = await Order.find({ status: 'On way' })

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render(`${user.language == 'English' ? 'order' : 'order_ru'}`, {
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
        const orders = await Order.find({ status: { $nin: ['Delivered', 'Dismissed'] } })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' })
        const cookingOrders = await Order.paginate(
            { status: "Cooking" },
            { page, limit, sort: { createdAt: -1 } }
        )
        const onWayOrders = await Order.find({ status: 'On way' })

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render(`${user.language == 'English' ? 'order' : 'order_ru'}`, {
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
        const orders = await Order.find({ status: { $nin: ['Delivered', 'Dismissed'] } })
        const waitAcceptOrders = await Order.find({ status: 'Wait accept' })
        const cookingOrders = await Order.find({ status: 'Cooking' })
        const onWayOrders = await Order.paginate(
            { status: "On way" },
            { page, limit, sort: { createdAt: -1 } }
        )

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render(`${user.language == 'English' ? 'order' : 'order_ru'}`, {
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

exports.dismissOrder = async (req, res) => {
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

        // Checking status and writing update to database.
        if (order.status == 'Delivered' || order.status == 'Dismissed') {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }
        order.status = 'Dismissed'
        await Order.findByIdAndUpdate(id, order)

        // Redirect.
        return res.redirect('/order')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}