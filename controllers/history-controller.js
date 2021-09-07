const apiResponse = require('../helpers/apiResponse')
const historyService = require('../services/history-service')
const cloneHistoryService = require('../services/clone-history-service')

class HistoryController {
  
  async listHistoryMinute(req, res) {
    let currencyFrom = req.query.currencyFrom
    let currencyTo = req.query.currencyTo
    let limit = req.query.limit
    try {
      let response = await historyService.getListHistoryMinute(currencyFrom, currencyTo, limit)
      return apiResponse.successResponseWithData(res, "", response)
    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err.toString())
    }
  }

  async listHistoryHour(req, res) {
    var currencyFrom = req.query.currencyFrom
    var currencyTo = req.query.currencyTo
    let limit = req.query.limit
    try {
      let response = await historyService.getListHistoryHour(currencyFrom, currencyTo, limit)
      return apiResponse.successResponseWithData(res, "", response)
    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err.toString())
    }
  }

  async refreshAllHistory(req, res) {
    try {
      let response = await cloneHistoryService.refreshAllHistory()
      return apiResponse.successResponseWithData(res, "Refresh success", response)
    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err.toString())
    }
  }
}

module.exports = new HistoryController