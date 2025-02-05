const { errorHandling } = require("./errorController")
const { Admin } = require('../model/userModel')
const { Booking } = require('../model/bookingModel')
const { Order } = require('../model/orderModel')

exports.rootController = async (req, res) => {
    try {
        // Get user.
        const user = await Admin.findById(req.cookies.userId)

        // Get all bookings for count.
        const bookings = await Booking.paginate({ is_canceled: false }, { page: 1, limit: 999 })

        // Get all orders for count.
        const orders = await Order.paginate({ status: 'Delivered' }, { page: 1, limit: 999 })

        let months = ''

        // Get last 30 days statistics.
        let lastMonthDays = []
        const today = new Date()
        today.setHours(5, 0, 0, 0)
        let thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const [tMonth, tDay, tYear] = today.toLocaleDateString().split('/').map(Number)
        switch (tDay) {
            case tDay: 1
                months += 'January'
                break;
            case tDay: 2
                months += 'February'
                break;
            case tDay: 3
                months += 'March'
                break;
            case tDay: 4
                months += 'Aprel'
                break;
            case tDay: 5
                months += 'May'
                break;
            case tDay: 6
                months += 'Juny'
                break;
            case tDay: 7
                months += 'July'
                break;
            case tDay: 8
                months += 'August'
                break;
            case tDay: 9
                months += 'September'
                break;
            case tDay: 10
                months += 'Oktomber'
                break;
            case tDay: 11
                months += 'November'
                break;
            case tDay: 12
                months += 'Desember'
                break;
        }



        let date = new Date(thirtyDaysAgo)
        const [month, day, year] = date.toLocaleDateString().split('/').map(Number)
        switch (day) {
            case day: 1
                months += ', January'
                break;
            case day: 2
                months += ', February'
                break;
            case day: 3
                months += ', March'
                break;
            case day: 4
                months += ', Aprel'
                break;
            case day: 5
                months += ', May'
                break;
            case day: 6
                months += ', Juny'
                break;
            case day: 7
                months += ', July'
                break;
            case day: 8
                months += ', August'
                break;
            case day: 9
                months += ', September'
                break;
            case day: 10
                months += ', Oktomber'
                break;
            case day: 11
                months += ', November'
                break;
            case day: 12
                months += ', Desember'
                break;
        }

        for (let i = 1; i <= 30; i++) {
            let date = new Date(thirtyDaysAgo)
            date.setDate(date.getDate() + i)
            const [month, day, year] = date.toLocaleDateString().split('/').map(Number)
            lastMonthDays.push(`${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`)
        }
        let bookingsForLastMonth = []
        for (const date of lastMonthDays) {
            const bookingsCurrentDate = bookings.docs.filter(booking => booking.date == date)
            bookingsForLastMonth.push(bookingsCurrentDate.length)
        }
        lastMonthDays = lastMonthDays.map(day => {
            const [year, month, currentDay] = day.split('-').map(Number)
            return currentDay
        })


        let orderCountForEveryDay = []

        // Rendering.
        return res.render('home', {
            layout: false,
            bookings,
            orders,
            user,
            lastMonthDays,
            bookingsForLastMonth,
            orderCountForEveryDay,
            months
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}