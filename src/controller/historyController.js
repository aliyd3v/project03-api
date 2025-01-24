const { Booking } = require("../model/bookingModel")
const { Order } = require("../model/orderModel")
const { errorHandling } = require("./errorController")

let page = 1
let limit = 10

exports.historyPage = async (req, res) => {
    try {
        let docs = []

        const order = await Order.paginate(
            { status: 'Delivered' },
            { sort: { createdAt: -1 } })
        const booking = await Booking.paginate(
            {},
            { sort: { createdAt: -1 } }
        )
        docs.push(...order.docs, ...booking.docs)

        console.log(docs)

        const totalCount = order.totalDocs + booking.totalDocs

        return res.render('history', {
            layout: false,
            isAll: true,
            totalCount,
            order,
            booking
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}