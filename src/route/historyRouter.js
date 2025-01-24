const { historyPage, orderHistoryPage, bookingHistoryPage } = require('../controller/historyController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')

const router = require('express').Router()

router
    .get('/history', jwtAccessMiddleware, historyPage)
    .get('/history/order', jwtAccessMiddleware, orderHistoryPage)
    .get('/history/booking', jwtAccessMiddleware, bookingHistoryPage)

module.exports = router