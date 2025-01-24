const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { getAllAdmins, adminCreate, deleteOneAdmin, adminsPage, profilePage, updateOneAdmin, adminCreatePage } = require('../controller/adminContoller')
const { createAdminValidationSchema } = require('../validation/adminCreateValidationSchema')
const { SUjwtAccessMiddleware } = require('../middleware/SUjwtAccessMiddleware')

const router = require('express').Router()

router
    .get('/admin-create', SUjwtAccessMiddleware, adminCreatePage)
    .post('/admin-create', SUjwtAccessMiddleware, checkSchema(createAdminValidationSchema), adminCreate)
    .get('/admin', SUjwtAccessMiddleware, adminsPage)
    .post('/admin/:id/delete', SUjwtAccessMiddleware, deleteOneAdmin)
    .post('/admin/:id/update', SUjwtAccessMiddleware, updateOneAdmin)
    .get('/profile', jwtAccessMiddleware, profilePage)

module.exports = router