const { loginPage, login, logout } = require('../controller/authController')
const { checkSchema } = require('express-validator')
const { loginValidationSchema } = require('../validation/loginValidationSchema')

const router = require('express').Router()

router
    .get('/login', loginPage)
    .post('/login', checkSchema(loginValidationSchema), login)
    .get('/logout', logout)

module.exports = router