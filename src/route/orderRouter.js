const { checkSchema } = require('express-validator')
const { orderPage, createOrderWithVerification, waitAcceptOrderPage, cookingOrderPage, onWayOrderPage, changingStatus, dismissOrder } = require('../controller/orderController')
const { orderCreateValidationSchema } = require('../validation/orderCreateValidationSchema')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')

const router = require('express').Router()

router
    .get('/order', jwtAccessMiddleware, orderPage)
    .get('/orders/wait-accept', jwtAccessMiddleware, waitAcceptOrderPage)
    .get('/orders/cooking', jwtAccessMiddleware, cookingOrderPage)
    .get('/orders/on-way', jwtAccessMiddleware, onWayOrderPage)
    .post('/order/create', checkSchema(orderCreateValidationSchema), createOrderWithVerification)
    .post('/order/:id/change-status', jwtAccessMiddleware, changingStatus)
    .post('/order/:id/dismiss', jwtAccessMiddleware, dismissOrder)

module.exports = router