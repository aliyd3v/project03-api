const { historyPage, orderHistoryPage, bookingHistoryPage, deliveredOrderHistoryPage, dismissedOrderHistoryPage } = require('../controller/historyController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')

const router = require('express').Router()

router
    .get('/history', jwtAccessMiddleware, historyPage)
    .get('/history/order', jwtAccessMiddleware, orderHistoryPage)
    .get('/history/order/delivered', jwtAccessMiddleware, deliveredOrderHistoryPage)
    .get('/history/order/dismissed', jwtAccessMiddleware, dismissedOrderHistoryPage)
    .get('/history/booking', jwtAccessMiddleware, bookingHistoryPage)

module.exports = router