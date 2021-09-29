const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const historyController = require('../controllers/history-controller')

router.get('/minute', historyController.listHistoryMinute)

router.get('/hour', historyController.listHistoryHour)

router.put('/refresh', historyController.refreshAllHistory)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router