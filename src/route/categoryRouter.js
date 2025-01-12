const router = require('express').Router()
const { categoryPage } = require('../controller/category/categoryController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { createCategory, getAllCategories, getOneCategory, updateOneCategory, deleteOneCategory, getCategoryMeals } = require('../controller/category/categoryController')
const { categoryCreateValidationSchema } = require('../validation/categoryCreateValidationSchema')
const { categoryUpdateValidationSchema } = require('../validation/categoryUpdateValidationSchema')
const { upload } = require('../helper/upload')
const { checkSchema } = require('express-validator')

router
    .get('/category', categoryPage)
    .post('/category/create', jwtAccessMiddleware, upload.single('file'), checkSchema(categoryCreateValidationSchema), createCategory)
    .get('/categories', getAllCategories)
    .get('/category/:id', getOneCategory)
    .get('/category/:id/meals', getCategoryMeals)
    .post('/category/:id/update', jwtAccessMiddleware, upload.single('file'), checkSchema(categoryUpdateValidationSchema), updateOneCategory)
    .post('/category/:id/delete', jwtAccessMiddleware, deleteOneCategory)

module.exports = router