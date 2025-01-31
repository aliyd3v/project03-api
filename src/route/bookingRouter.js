const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { getAllActiveBooking, deactivateBooking } = require('../controller/bookingController')

const router = require('express').Router()

router
    .get('/booking', jwtAccessMiddleware, getAllActiveBooking)
    .post('/booking/:id/deactivate', deactivateBooking)

module.exports = router