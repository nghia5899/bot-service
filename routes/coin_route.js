const express = require('express')
const router = express.Router()

const coinController = require('../controllers/coin_controller')

router.get('/listAllCoin', coinController.listAllCurrency)

router.post('/addCoin', coinController.addCoin)

router.delete('/deleteCoin', coinController.deleteCoin)

router.post('/initCoin', coinController.initCoin)

router.use('/', (req, res) => {
  console.log("/coin")
})

module.exports = router