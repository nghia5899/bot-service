const express = require('express')
const router = express.Router()

const historyController = require('../controllers/history_controller')

router.get('/listHistoryMinute', historyController.listHistoryMinute)

router.get('/listHistoryHour', historyController.listHistoryHour)

router.get('/refreshAllHistory', historyController.refreshAllHistory)

router.use('/', (req, res) => {
  res.sendStatus(404).send('Not found')
})

module.exports = router