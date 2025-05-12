const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { createStol, getAllStols, getOneStol, updateOneStol, deleteOneStol, createStolPage, updateOneStolPage } = require('../controller/stolController')
const { stolCreateValidationSchema } = require('../validation/stolCreateValidationSchema')
const { stolUpdateValidationSchema } = require('../validation/stolUpdateValidationSchema')

const router = require('express').Router()

router
    .get('/stol/create', jwtAccessMiddleware, createStolPage)
    .post('/stol/create', jwtAccessMiddleware, checkSchema(stolCreateValidationSchema), createStol)
    .get('/stol', jwtAccessMiddleware, getAllStols)
    .get('/stol/:id/update', jwtAccessMiddleware, updateOneStolPage)
    .post('/stol/:id/update', jwtAccessMiddleware, checkSchema(stolUpdateValidationSchema), updateOneStol)
    .post('/stol/:id/delete', jwtAccessMiddleware, deleteOneStol)

module.exports = router