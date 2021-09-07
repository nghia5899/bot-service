const express = require('express')
const router = express.Router()
const apiResponse = require('../helpers/apiResponse')

const coinController = require('../controllers/coin-controller')

router.get('/', coinController.listAllCurrency)

router.post('/', coinController.addCoin)

router.delete('/', coinController.deleteCoin)

router.use('/', (req, res) => {
  return apiResponse.notFoundResponse(res, "Not found")
})

module.exports = router