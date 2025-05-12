const { mealPage, createMeal, getAllMeals, getOneMeal, updateOneMeal, deleteOneMeal, createMealPage, updateMealPage, mealSortByCategory } = require('../controller/mealController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { upload } = require('../helper/upload')
const { checkSchema } = require('express-validator')
const { mealCreateValidationSchema } = require('../validation/mealCreateValidationSchema')
const { mealUpdateValidationSchema } = require('../validation/mealUpdateValidationSchema')

const router = require('express').Router()

router
    .get('/meal', jwtAccessMiddleware, mealPage)
    .get('/meal/create', jwtAccessMiddleware, createMealPage)
    .post('/meal/create', jwtAccessMiddleware, upload.single('file'), checkSchema(mealCreateValidationSchema), createMeal)
    .get('/meal/:id/update', jwtAccessMiddleware, updateMealPage)
    .post('/meal/:id/update', jwtAccessMiddleware, upload.single('file'), checkSchema(mealUpdateValidationSchema), updateOneMeal)
    .post('/meal/:id/delete', jwtAccessMiddleware, deleteOneMeal)
    .get('/meal-sort/:id', jwtAccessMiddleware, mealSortByCategory)

module.exports = router