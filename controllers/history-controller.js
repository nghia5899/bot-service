const historyService = require('../services/history-service')
const cloneHistoryService = require('../services/clone-history-service')
const {ResponseData} = require('../helpers/response-data')

class HistoryController {
  
  async listHistoryMinute(req, res) {
    let currencyFrom = req.query.currencyFrom
    currencyFrom = currencyFrom.toUpperCase()
    if (currencyFrom.toUpperCase() == 'BSC') currencyFrom = 'BNB'
    let currencyTo = req.query.currencyTo
    currencyTo = currencyTo.toUpperCase()

    let limit = req.query.limit
    try {
      let response = await historyService.getListHistoryMinute(currencyFrom, currencyTo, limit)
      return res.json(new ResponseData(true, "", response).toJson())
    } catch (err) {
      console.log(err)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async listHistoryHour(req, res) {
    let currencyFrom = req.query.currencyFrom
    currencyFrom = currencyFrom.toUpperCase()
    if (currencyFrom.toUpperCase() == 'BSC') currencyFrom = 'BNB'
    let currencyTo = req.query.currencyTo
    currencyTo = currencyTo.toUpperCase()
    
    let limit = req.query.limit
    try {
      let response = await historyService.getListHistoryHour(currencyFrom, currencyTo, limit)
      return res.json(new ResponseData(true, "", response).toJson())
    } catch (err) {
      console.log(err)
      return res.json(new ResponseData(false, err).toJson())
    }
  }

  async refreshAllHistory(req, res) {
    try {
      cloneHistoryService.refreshAllHistory()
      return res.json(new ResponseData(true, "Refresh success").toJson())
    } catch (err) {
      console.log(err)
      return res.json(new ResponseData(false, e).toJson())
    }
  }
}

module.exports = new HistoryController