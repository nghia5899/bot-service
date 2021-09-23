const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const coinController = require('../controllers/coin-controller')

router.get('/', coinController.listAllCoin)

router.post('/', coinController.addCoin)

router.delete('/', coinController.deleteCoin)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router