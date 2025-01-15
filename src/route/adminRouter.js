const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { getAllAdmins, adminCreate, deleteOneAdmin, adminsPage } = require('../controller/adminContoller')
const { createAdminValidationSchema } = require('../validation/adminCreateValidationSchema')

const router = require('express').Router()

router
    .post('/admin-create', jwtAccessMiddleware, checkSchema(createAdminValidationSchema), adminCreate)
    .get('/admin', adminsPage)
    .get('/admins', jwtAccessMiddleware, getAllAdmins)
    .post('/admin/:id', jwtAccessMiddleware, deleteOneAdmin)

module.exports = router