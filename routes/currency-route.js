const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const currencyController = require('../controllers/currency-controller')

router.post('/', currencyController.addCoupleCurrency)

router.delete('/', currencyController.deleteCoupleCurrency)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router