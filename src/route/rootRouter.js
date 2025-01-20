const { rootController } = require('../controller/rootController')
const { jwtAccessMiddleware } = require('../middleware/jwtAccessMiddleware')

const router = require('express').Router()

router.get('/', jwtAccessMiddleware, rootController)

module.exports = router