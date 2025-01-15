const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { createStol, getAllStols, getOneStol, updateOneStol, deleteOneStol } = require('../controller/stolController')
const { stolCreateValidationSchema } = require('../validation/stolCreateValidationSchema')
const { stolUpdateValidationSchema } = require('../validation/stolUpdateValidationSchema')

const router = require('express').Router()

router
    .post('/stol/create', jwtAccessMiddleware, checkSchema(stolCreateValidationSchema), createStol)
    .get('/stol', getAllStols)
    .get('/stol/:id', jwtAccessMiddleware, getOneStol)
    .post('/stol/:id/update', jwtAccessMiddleware, checkSchema(stolUpdateValidationSchema), updateOneStol)
    .post('/stol/:id/delete', jwtAccessMiddleware, deleteOneStol)

module.exports = router