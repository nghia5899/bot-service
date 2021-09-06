const { CoupleCurrency } = require('../models/couple_currency')
const { History } = require('../models/history_model')
const cloneHistoryService = require('./clone_history_service') 

const LIMIT_1_HOUR = 61
const LIMIT_1_DAY = 1450
const LIMIT_1_WEEK = 169
const LIMIT_1_MONTH = 726

async function insertCoupleCurrency(list) {
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
}

async function deleteCoupleCurrency(list) {
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
}

function CoupleCurrencyData(coupleCurrency) {
  return CoupleCurrency({
    currencyfrom: coupleCurrency.currencyFrom,
    currencyto: coupleCurrency.currencyTo,
  })
}

module.exports = {
  insertCoupleCurrency,
  deleteCoupleCurrency
}