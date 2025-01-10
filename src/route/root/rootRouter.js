const { rootController } = require('../../controller/root/rootController')

const router = require('express').Router()

router.get('/', rootController)

module.exports = router