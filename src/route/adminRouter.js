const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { getAllAdmins, adminCreate, deleteOneAdmin, adminsPage } = require('../controller/adminContoller')
const { createAdminValidationSchema } = require('../validation/adminCreateValidationSchema')
const { SUjwtAccessMiddleware } = require('../middleware/SUjwtAccessMiddleware')

const router = require('express').Router()

router
    .post('/admin-create', SUjwtAccessMiddleware, checkSchema(createAdminValidationSchema), adminCreate)
    .get('/admin', adminsPage)
    .get('/admins', jwtAccessMiddleware, getAllAdmins)
    .post('/admin/:id', SUjwtAccessMiddleware, deleteOneAdmin)

module.exports = router