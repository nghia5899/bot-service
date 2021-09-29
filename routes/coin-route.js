const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const coinController = require('../controllers/coin-controller')
const authController = require('../controllers/auth-controller')

router.get('/', coinController.listAllCoin)

router.post('/', authController.isAuth, coinController.addCoin)

router.delete('/', authController.isAuth, coinController.deleteCoin)

router.get('/fee', coinController.feeWithdraw)

router.get('/currency', coinController.getCurrencyByCode)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router