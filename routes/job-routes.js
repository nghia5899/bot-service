const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const jobController = require('../job/job')

router.post('/', jobController.startJob)

router.delete('/', jobController.stopJob)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router