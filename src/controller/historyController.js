const { Booking } = require("../model/bookingModel")
const { Order } = require("../model/orderModel")
const { errorHandling } = require("./errorController")
const { Admin } = require('../model/userModel')

let page = 1
let limit = 4

exports.historyPage = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Get all history.
        let docs = []
        const order = await Order.paginate(
            { status: { $in: ['Delivered', 'Dismissed'] } },
            { sort: { createdAt: -1 } })

        let today = new Date();
        const [month, day, year] = today.toLocaleDateString().split('/').map(Number)
        today = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`

        const booking = await Booking.paginate(
            { date: { $lte: today } },
            { sort: { createdAt: -1 } }
        )
        docs.push(...order.docs, ...booking.docs)

        const totalCount = order.totalDocs + booking.totalDocs

        return res.render('history', {
            layout: false,
            isAll: true,
            totalCount,
            order,
            booking,
            user
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.orderHistoryPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : false

        // Get orders with status "Delivered" and "Dismissed".
        const orders = await Order.paginate(
            { status: { $in: ['Delivered', 'Dismissed'] } },
            { page, limit, sort: { createdAt: -1 } }
        )
        const deliveredOrders = await Order.paginate({ status: 'Delivered' }, { page: 1, limit: 0 })
        const dismissedOrders = await Order.paginate({ status: 'Dismissed' }, { page: 1, limit: 0 })
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order-history', {
            layout: false,
            user,
            orders,
            isAll: true,
            deliveredOrders,
            dismissedOrders
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deliveredOrderHistoryPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : false

        // Get orders with status "Delivered" and "Dismissed".
        const deliveredOrders = await Order.paginate({ status: 'Delivered' }, { page, limit, sort: { createdAt: -1 } })
        const orders = await Order.paginate(
            { status: { $in: ['Delivered', 'Dismissed'] } },
            { page: 1, limit: 0 }
        )
        const dismissedOrders = await Order.paginate({ status: 'Dismissed' }, { page: 1, limit: 0 })
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order-history', {
            layout: false,
            user,
            orders,
            isDelivered: true,
            deliveredOrders,
            dismissedOrders
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.dismissedOrderHistoryPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : false

        // Get orders with status "Delivered" and "Dismissed".
        const dismissedOrders = await Order.paginate({ status: 'Dismissed' }, { page, limit, sort: { createdAt: -1 } })
        const orders = await Order.paginate(
            { status: { $in: ['Delivered', 'Dismissed'] } },
            { page: 1, limit: 0 }
        )
        const deliveredOrders = await Order.paginate({ status: 'Delivered' }, { page: 1, limit: 0 })
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order-history', {
            layout: false,
            user,
            orders,
            isDismissed: true,
            deliveredOrders,
            dismissedOrders
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.bookingHistoryPage = async (req, res) => {
    const { query } = req
    try {
        query.page ? page = query.page : false

        // Get bookings.
        const bookings = await Booking.paginate(
            {},
            { page, limit, sort: { createdAt: -1 } }
        )

        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Rendering.
        return res.render('order-history', {
            layout: false,
            user,
            bookings
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}