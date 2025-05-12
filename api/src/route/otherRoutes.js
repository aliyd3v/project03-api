const { checkSchema } = require('express-validator')
const { getOneCustomer } = require('../controller/customerContoller')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { getOneCustomerValidationSchema } = require('../validation/getOneCustomerValidationSchema')
const { searchMCategoriesValidatorSchema } = require('../validation/searchCategoriesValidationSchema')
const { searchingCategory, searchingMeals, searchCustomer } = require('../controller/searchController')
const { searchMealsValidatorSchema } = require('../validation/searchMealsValidationSchema')
const { searchCustomerValidatorSchema } = require('../validation/searchCustomerValidatorSchema')
const { directNotFound } = require('../controller/directNotFoundMessage')
const { badRequest } = require('../controller/badRequestPage')

const router = require('express').Router()

router
    // Customer route for admin.
    .get('/customer/get-one', jwtAccessMiddleware, checkSchema(getOneCustomerValidationSchema), getOneCustomer)

    // Search route.
    .get('/search/category', checkSchema(searchMCategoriesValidatorSchema), searchingCategory)
    .get('/search/meal', checkSchema(searchMealsValidatorSchema), searchingMeals)
    .get('/search/search', jwtAccessMiddleware, checkSchema(searchCustomerValidatorSchema), searchCustomer)

    // Bad request message.
    .get('/bad-request', badRequest)

    // Direct not found message.
    .use(jwtAccessMiddleware, directNotFound)

module.exports = router