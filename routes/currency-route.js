const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const currencyController = require('../controllers/currency-controller')
const authController = require('../controllers/auth-controller')
const currencyService = require('../services/currency-service')

router.get('/', currencyController.getAllCoupleCurrency)

router.post('/', authController.isAuth, currencyController.addCoupleCurrency)

router.get('/currency-info', currencyController.getCurrencyByContractAddress)

router.post('/validate-address', currencyController.validateAddress)

router.delete('/', currencyController.deleteCoupleCurrency)
router.delete('/', authController.isAuth, currencyController.deleteCoupleCurrency)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router