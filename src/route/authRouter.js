const { loginPage, login } = require('../controller/authController')
const { checkSchema } = require('express-validator')
const { loginValidationSchema } = require('../validation/loginValidationSchema')

const router = require('express').Router()

router
    .get('/login', loginPage)
    .post('/login', checkSchema(loginValidationSchema), login)

module.exports = router