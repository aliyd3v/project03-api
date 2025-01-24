const router = require('express').Router()
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { categoryPage, createCategory, getAllCategories, getOneCategory, updateOneCategory, deleteOneCategory, getCategoryMeals, updateCategoryPage, createCategoryPage } = require('../controller/categoryController')
const { categoryCreateValidationSchema } = require('../validation/categoryCreateValidationSchema')
const { categoryUpdateValidationSchema } = require('../validation/categoryUpdateValidationSchema')
const { upload } = require('../helper/upload')
const { checkSchema } = require('express-validator')

router
    .get('/category', jwtAccessMiddleware, categoryPage)
    .get('/category/create', jwtAccessMiddleware, createCategoryPage)
    .post('/category/create', jwtAccessMiddleware, upload.single('file'), checkSchema(categoryCreateValidationSchema), createCategory)
    .get('/category/:id/meals', getCategoryMeals)
    .get('/category/:id/update', jwtAccessMiddleware, updateCategoryPage)
    .post('/category/:id/update', jwtAccessMiddleware, upload.single('file'), checkSchema(categoryUpdateValidationSchema), updateOneCategory)
    .post('/category/:id/delete', jwtAccessMiddleware, deleteOneCategory)

module.exports = router