const { createBookingWithVerification, checkBookingForAvailability } = require('../controller/bookingController')
const { bookingCreateValidationSchema } = require('../../validation/bookingCreateValidationSchema')
const { getAllCategories, getOneCategory, getCategoryMeals } = require('../controller/categoryController')
const { getAllMeals, getOneMeal } = require('../controller/mealController')
const { createOrderWithVerification } = require('../controller/orderController')
const { orderCreateValidationSchema } = require('../../validation/orderCreateValidationSchema')
const { createVerifyValidationSchema } = require('../../validation/createVerifyValidationSchema')
const { createVerifyForGetAllBookingAndOrder, verifyTokenAndCreateOrderOrBooking } = require('../controller/verifyContorller')
const { queryEmailValidationSchema } = require('../../validation/queryEmailValidationSchema')
const { cancelBookingForCustomer } = require('../controller/customerContoller')
const { searchMCategoriesValidatorSchema } = require('../../validation/searchCategoriesValidationSchema')
const { searchingCategory, searchingMeals } = require('../controller/searchController')
const { searchMealsValidatorSchema } = require('../../validation/searchMealsValidationSchema')
const { getAllStols, getOneStol } = require('../controller/stolController')
const { checkSchema } = require('express-validator')

const router = require('express').Router()

router
    //  Booking route.
    .post('/booking/create', checkSchema(bookingCreateValidationSchema), createBookingWithVerification)
    .get('/booking/availability', checkBookingForAvailability)

    // Category route.
    .get('/categories', getAllCategories)
    .get('/category/:id', getOneCategory)
    .get('/category/:id/meals', getCategoryMeals)

    // Meal route.
    .get('/meals', getAllMeals)
    .get('/meal/:id', getOneMeal)

    // Order route.
    .post('/order/create', checkSchema(orderCreateValidationSchema), createOrderWithVerification)

    // Customer cabinet route.
    .post('/cabinet/create-verify', checkSchema(createVerifyValidationSchema), createVerifyForGetAllBookingAndOrder)
    .post('/cabinet/cancel-booking/:id', checkSchema(queryEmailValidationSchema), cancelBookingForCustomer)

    // Verify token route.
    .get('/verify/:id', verifyTokenAndCreateOrderOrBooking)

    // Search route.
    .get('/search/category', checkSchema(searchMCategoriesValidatorSchema), searchingCategory)
    .get('/search/meal', checkSchema(searchMealsValidatorSchema), searchingMeals)

    // Stol route.
    .get('/stol', getAllStols)
    .get('/stol/:id', getOneStol)

    // Direct not found message.
    .use((req, res) => {
        // Responding.
        return res.status(404).send({
            success: false,
            data: null,
            error: { message: "Direct is not found!" }
        })
    })

module.exports = router