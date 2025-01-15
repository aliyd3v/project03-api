const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { createBookingWithVerification, getAllBooking, getAllActiveBooking, checkBookingForAvailability, getOneBooking, deactivateBooking } = require('../controller/bookingController')
const { bookingCreateValidationSchema } = require('../validation/bookingCreateValidationSchema')

const router = require('express').Router()

router
    .post('/booking/create', checkSchema(bookingCreateValidationSchema), createBookingWithVerification)
    .get('/booking', jwtAccessMiddleware, getAllBooking)
    .get('/booking/active', jwtAccessMiddleware, getAllActiveBooking)
    .get('/booking/availability', checkBookingForAvailability)
    .get('/booking/:id', jwtAccessMiddleware, getOneBooking)
    .post('/booking/:id/deactivate', deactivateBooking) // For admins

module.exports = router