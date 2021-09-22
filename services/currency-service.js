const { CoupleCurrency } = require('../models/couple-currency')
const { History } = require('../models/history-model')
const cloneHistoryService = require('./clone-history-service') 

const LIMIT_1_HOUR = 61
const LIMIT_1_DAY = 1450
const LIMIT_1_WEEK = 169
const LIMIT_1_MONTH = 726

let currencyService = {

  async insertCoupleCurrency(list) {
    try {
      var listCoupleCurrency = list
      listCoupleCurrency.forEach(element => {
        try {
          let currency = new CoupleCurrency(CoupleCurrencyData(element))
          currency.save((err) => {
            if (err) throw err
            cloneHistoryService.addHistoryMinute(element.currencyFrom, element.currencyTo, LIMIT_1_DAY)
            cloneHistoryService.addHistoryHour(element.currencyFrom, element.currencyTo, LIMIT_1_MONTH)
          })
        } catch (e) {
          console.log(e)
          console.log('Couple currency already exist')
        }
      })
    } catch (e) {
      throw e
    }
  },
  
  async deleteCoupleCurrency(list) {
    let listCoupleCurrency = list
    listCoupleCurrency.forEach(element => {
      try {
        let filter = {
          currencyfrom: element.currencyFrom,
          currencyto: element.currencyTo,
        }
        CoupleCurrency.collection.deleteOne(filter)
        History.collection.deleteMany(filter)
      } catch (e) {
        throw e
      }
    })
  },

  async initCoupleCurrency() {
    try {
      let listCoupleCurrency = await CoupleCurrency.find({}, {_id: 0, _v: 0})
      if (!listCoupleCurrency.length) {
        let listCoin = [
          {
            "currencyFrom": "BTC",
            "currencyTo": "USDT"
          },
          {
            "currencyFrom": "ETH",
            "currencyTo": "USDT"
          },
          {
            "currencyFrom": "TRX",
            "currencyTo": "USDT"
          },
          {
            "currencyFrom": "BNB",
            "currencyTo": "USDT"
          },
        ]
        this.insertCoupleCurrency(listCoin)
      } 
    } catch (e) {
      console.log(e)
      throw e
    }
  }

}

function CoupleCurrencyData(coupleCurrency) {
  return CoupleCurrency({
    currencyfrom: coupleCurrency.currencyFrom,
    currencyto: coupleCurrency.currencyTo,
  })
}

module.exports = currencyService