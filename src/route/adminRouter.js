const { checkSchema } = require('express-validator')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')
const { adminCreate, deleteOneAdmin, adminsPage, profilePage, updateOneAdmin, adminCreatePage, updateAdminPage, updatePasswordAdmin, updatePasswordAdminPage, profileLanguageUpdate } = require('../controller/adminContoller')
const { createAdminValidationSchema } = require('../validation/adminCreateValidationSchema')
const { SUjwtAccessMiddleware } = require('../middleware/SUjwtAccessMiddleware')
const { upload } = require('../helper/upload')
const { updateAdminValidationSchema } = require('../validation/adminUpdateValidationSchema')
const { adminPasswordUdpateValidationSchema } = require('../validation/adminPasswordUpdateValidationSchema')

const router = require('express').Router()

router
    .get('/admin-create', SUjwtAccessMiddleware, adminCreatePage)
    .post('/admin-create', SUjwtAccessMiddleware, upload.single('file'), checkSchema(createAdminValidationSchema), adminCreate)
    .get('/admin', SUjwtAccessMiddleware, adminsPage)
    .post('/admin/:id/delete', SUjwtAccessMiddleware, deleteOneAdmin)
    .get('/admin/:id/update', SUjwtAccessMiddleware, updateAdminPage)
    .post('/admin/:id/update', SUjwtAccessMiddleware, upload.single('file'), checkSchema(updateAdminValidationSchema), updateOneAdmin)
    .get('/admin/:id/update-password', SUjwtAccessMiddleware, updatePasswordAdminPage)
    .post('/admin/:id/update-password', SUjwtAccessMiddleware, checkSchema(adminPasswordUdpateValidationSchema), updatePasswordAdmin)
    .get('/profile', jwtAccessMiddleware, profilePage)
    .post('/profile/:id/update/language', jwtAccessMiddleware, profileLanguageUpdate)

module.exports = router