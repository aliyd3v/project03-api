const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { createBookingWithVerification, getAllBooking, getAllActiveBooking, checkBookingForAvailability, getOneBooking, deactivateBooking } = require('../controller/bookingController')
const { bookingCreateValidationSchema } = require('../validation/bookingCreateValidationSchema')

const router = require('express').Router()

router
    .post('/booking/create', checkSchema(bookingCreateValidationSchema), createBookingWithVerification)
    .get('/booking', jwtAccessMiddleware, getAllActiveBooking)
    .get('/booking/availability', checkBookingForAvailability)
    .post('/booking/:id/deactivate', deactivateBooking) // For admins

module.exports = router