const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const jobController = require('../job/job')
const authController = require('../controllers/auth-controller')

router.post('/', authController.isAuth, jobController.startJob)

router.delete('/', authController.isAuth, jobController.stopJob)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router