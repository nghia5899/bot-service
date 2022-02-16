const express = require('express')
const router = express.Router()
const {ResponseData} = require('../helpers/response-data')
const coinController = require('../controllers/coin-controller')
const authController = require('../controllers/auth-controller')
const feeController = require('../controllers/fee-controller')

router.get('/', coinController.listAllCoin)

router.post('/', authController.isAuth, coinController.addCoin)

router.put('/', authController.isAuth, coinController.updateCoin)

router.put('/status', authController.isAuth, coinController.changeStatusCoin)

router.get('/marketdata', coinController.listCoinBalance)

router.get('/fee', coinController.feeWithdraw)

router.get('/currency', feeController.getFee)
router.post('/currency/xrp', feeController.getXrpFee)

router.get('/list-transactions', coinController.getListTransactions)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router