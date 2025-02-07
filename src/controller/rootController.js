const { errorHandling } = require("./errorController")
const { Admin } = require('../model/userModel')
const { Booking } = require('../model/bookingModel')
const { Order } = require('../model/orderModel')
const { Meal } = require("../model/mealModel")
const { Category } = require("../model/categoryModel")

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
        let orderCountForEveryDay = []
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
            orderCountForEveryDay.push(ordersCurrentDate.length)
        }
        // Get last month days.
        lastMonthDays = lastMonthDays.map(day => {
            const [year, month, currentDay] = day.split('-').map(Number)
            return currentDay
        })

        // let meals = await Meal.paginate({}, { page: 1, limit: 0 })
        // let categories = await Category.paginate({}, { page: 1, limit: 0 })

        // Count last month incomes with the month before last month.


        // Rendering.
        return res.render('home', {
            layout: false,
            bookings,
            orders,
            user,
            lastMonthDays,
            bookingsForLastMonth,
            orderCountForEveryDay,
            months,
            // meals,
            // categories
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}