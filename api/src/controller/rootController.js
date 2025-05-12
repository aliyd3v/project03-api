const { errorHandling } = require("./errorController")
const { Admin } = require('../model/userModel')
const { Booking } = require('../model/bookingModel')
const { Order } = require('../model/orderModel')

exports.rootController = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Get last 30 days statistics.
        let months = ''
        let lastMonthDays = []
        const today = new Date()
        today.setHours(5, 0, 0, 0)
        let thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const [tMonth, tDay, tYear] = today.toLocaleDateString().split('/').map(Number)
        let date = new Date(thirtyDaysAgo)
        const [month, day, year] = date.toLocaleDateString().split('/').map(Number)
        switch (month) {
            case 1:
                months += 'January'
                break;
            case 2:
                months += 'February'
                break;
            case 3:
                months += 'March'
                break;
            case 4:
                months += 'Aprel'
                break;
            case 5:
                months += 'May'
                break;
            case 6:
                months += 'Juny'
                break;
            case 7:
                months += 'July'
                break;
            case 8:
                months += 'August'
                break;
            case 9:
                months += 'September'
                break;
            case 10:
                months += 'Oktomber'
                break;
            case 11:
                months += 'November'
                break;
            case 12:
                months += 'Desember'
                break;
        }
        switch (tMonth) {
            case 1:
                months += ', January'
                break;
            case 2:
                months += ', February'
                break;
            case 3:
                months += ', March'
                break;
            case 4:
                months += ', Aprel'
                break;
            case 5:
                months += ', May'
                break;
            case 6:
                months += ', Juny'
                break;
            case 7:
                months += ', July'
                break;
            case 8:
                months += ', August'
                break;
            case 9:
                months += ', September'
                break;
            case 10:
                months += ', Oktomber'
                break;
            case 11:
                months += ', November'
                break;
            case 12:
                months += ', Desember'
                break;
        }
        for (let i = 1; i <= 30; i++) {
            let date = new Date(thirtyDaysAgo)
            date.setDate(date.getDate() + i)
            const [month, day, year] = date.toLocaleDateString().split('/').map(Number)
            lastMonthDays.push(`${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`)
        }
        // Get all bookings for count.
        let bookingsForLastMonth = []
        const bookings = await Booking.paginate(
            { is_canceled: false },
            { page: 1, limit: 999999 }
        )
        for (const date of lastMonthDays) {
            const bookingsCurrentDate = bookings.docs.filter(booking => booking.date == date)
            bookingsForLastMonth.push(bookingsCurrentDate.length)
        }
        // Get all orders for count.
        let orderCountForLastMonth = []
        const orders = await Order.paginate(
            { status: 'Delivered' },
            { page: 1, limit: 999999 }
        )
        for (const date of lastMonthDays) {
            const ordersCurrentDate = orders.docs.filter(order => {
                const [month, day, year] = order.createdAt.toLocaleDateString().split('/').map(Number)
                orderCreatedDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
                return orderCreatedDate == date
            })
            orderCountForLastMonth.push(ordersCurrentDate.length)
        }
        // Get last month days.
        lastMonthDays = lastMonthDays.map(day => {
            const [year, month, currentDay] = day.split('-').map(Number)
            return currentDay
        })

        // Get last second month start date.
        let lastSecondMonthDays = []
        let twoMonthAgo = new Date(thirtyDaysAgo)
        twoMonthAgo.setDate(twoMonthAgo.getDate() - 30)
        for (let i = 1; i <= 30; i++) {
            let date = new Date(twoMonthAgo)
            date.setDate(date.getDate() + i)
            const [month, day, year] = date.toLocaleDateString().split('/').map(Number)
            lastSecondMonthDays.push(`${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`)
        }
        // Get all bookings count for last second month.
        let bookingsForLastSecondMonth = []
        for (const date of lastSecondMonthDays) {
            const bookingsCurrentDate = bookings.docs.filter(booking => booking.date == date)
            bookingsForLastSecondMonth.push(bookingsCurrentDate.length)
        }
        // Get all orders count fol last second month.
        let orderCountForLastSecondMonth = []
        for (const date of lastSecondMonthDays) {
            const ordersCurrentDate = orders.docs.filter(order => {
                const [month, day, year] = order.createdAt.toLocaleDateString().split('/').map(Number)
                orderCreatedDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
                return orderCreatedDate == date
            })
            orderCountForLastSecondMonth.push(ordersCurrentDate.length)
        }

        // Getting difference for last two months.
        // For booking.
        let countAllBookingLastMonth = 0
        for (const value of bookingsForLastMonth) {
            countAllBookingLastMonth += value
        }
        let countAllBookingSecondLastMonth = 0
        for (const value of bookingsForLastSecondMonth) {
            countAllBookingSecondLastMonth += value
        }
        let fromLastMonthBooking = countAllBookingLastMonth - countAllBookingSecondLastMonth
        fromLastMonthBooking = fromLastMonthBooking < 1 ? `${fromLastMonthBooking}` : `+${fromLastMonthBooking}`
        // For order.
        let countAllOrdersLastMonth = 0
        for (const value of orderCountForLastMonth) {
            countAllOrdersLastMonth += value
        }
        let countAllOrdersSecondLastMonth = 0
        for (const value of orderCountForLastSecondMonth) {
            countAllOrdersSecondLastMonth += value
        }
        let fromLastMonthOrders = countAllOrdersLastMonth - countAllOrdersSecondLastMonth
        fromLastMonthOrders = fromLastMonthOrders < 1 ? `${fromLastMonthOrders}` : `+${fromLastMonthOrders}`

        // Rendering.
        return res.render(`${user.language == 'English' ? 'home' : 'home_ru'}`, {
            layout: false,
            bookings,
            orders,
            user,
            lastMonthDays,
            bookingsForLastMonth,
            orderCountForLastMonth,
            months,
            fromLastMonthBooking,
            fromLastMonthOrders,
            // meals,
            // categories
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}