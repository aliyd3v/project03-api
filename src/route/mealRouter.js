const { mealPage, createMeal, getAllMeals, getOneMeal, updateOneMeal, deleteOneMeal } = require('../controller/mealController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { upload } = require('../helper/upload')
const { checkSchema } = require('express-validator')
const { mealCreateValidationSchema } = require('../validation/mealCreateValidationSchema')
const { mealUpdateValidationSchema } = require('../validation/mealUpdateValidationSchema')

const router = require('express').Router()

router
    .get('/meal', jwtAccessMiddleware, mealPage)
    .post('/meal/create', jwtAccessMiddleware, upload.single('file'), checkSchema(mealCreateValidationSchema), createMeal)
    .get('/meals', getAllMeals)
    .get('/meal/:id', getOneMeal)
    .post('/meal/:id/update', jwtAccessMiddleware, checkSchema(mealUpdateValidationSchema), updateOneMeal)
    .post('/meal/:id/delete', jwtAccessMiddleware, deleteOneMeal)

module.exports = router