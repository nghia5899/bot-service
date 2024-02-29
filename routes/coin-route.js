const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const coinController = require('../controllers/coin-controller')
const jobController = require('../controllers/job-controller')

router.get('/', coinController.listAllCoin)

router.post('/addWallet', coinController.addWallet)

router.post('/start', jobController.startJob)

router.post('/stop', jobController.stopJob)


router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router