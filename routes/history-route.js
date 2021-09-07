const express = require('express')
const router = express.Router()
const apiResponse = require('../helpers/apiResponse')
const historyController = require('../controllers/history-controller')

router.get('/minute', historyController.listHistoryMinute)

router.get('/hour', historyController.listHistoryHour)

router.put('/refresh', historyController.refreshAllHistory)

router.use('/', (req, res) => {
  return apiResponse.notFoundResponse(res, "Not found")
})

module.exports = router