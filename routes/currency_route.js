const express = require('express')
const router = express.Router()

const currencyController = require('../controllers/currency_controller')

router.post('/addCoupleCurrency', currencyController.addCoupleCurrency)

router.delete('/deleteCoupleCurrency', currencyController.deleteCoupleCurrency)

router.use('/', (req, res) => {
  console.log("/currency")
})

module.exports = router