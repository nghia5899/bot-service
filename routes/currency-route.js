const express = require('express')
const router = express.Router()
const apiResponse = require('../helpers/apiResponse')
const currencyController = require('../controllers/currency-controller')

router.post('/', currencyController.addCoupleCurrency)

router.delete('/', currencyController.deleteCoupleCurrency)

router.use('/', (req, res) => {
  return apiResponse.notFoundResponse(res, "Not found")
})

module.exports = router