const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const authController = require('../controllers/auth-controller')

router.post('/login', authController.login)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router