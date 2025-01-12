const { rootController } = require('../controller/rootController')

const router = require('express').Router()

router.get('/', rootController)

module.exports = router