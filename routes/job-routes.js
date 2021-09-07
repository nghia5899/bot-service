const express = require('express')
const router = express.Router()
const apiResponse = require('../helpers/apiResponse')
const jobController = require('../job/job')

router.post('/', jobController.startJob)

router.delete('/', jobController.stopJob)

router.use('/', (req, res) => {
  return apiResponse.notFoundResponse(res, "Not found")
})

module.exports = router