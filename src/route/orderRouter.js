const { checkSchema } = require('express-validator')
const { orderPage, getAllActualOrders, createOrderWithVerification, getOneOrder, markAsDelivered } = require('../controller/orderController')
const { orderCreateValidationSchema } = require('../validation/orderCreateValidationSchema')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')

const router = require('express').Router()

router
    .get('/order', orderPage)
    .post('/order/create', checkSchema(orderCreateValidationSchema), createOrderWithVerification)
    .get('/orders', jwtAccessMiddleware, getAllActualOrders)
    .get('/order/:id', jwtAccessMiddleware, getOneOrder)
    .post('/order/:id/delivered', markAsDelivered)

module.exports = router