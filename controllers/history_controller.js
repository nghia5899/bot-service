const { History } = require('../models/history_model')
const convertUtil = require('../utils/convert')
const apiResponse = require('../helpers/apiResponse')
const historyService = require('../services/history_service')
const cloneHistoryService = require('../services/clone_history_service')

class HistoryController {
  async listHistoryMinute(req, res) {
    let currency_from = req.query.currencyFrom
    let currency_to = req.query.currencyTo
    let limit = req.query.limit
    try {
      let response = await historyService.getListHistoryMinute(currency_from, currency_to, limit)
      return apiResponse.successResponseWithData(res, "", response)
    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err.toString())
    }
  }

  async listHistoryHour(req, res) {
    var currency_from = req.query.currencyFrom
    var currency_to = req.query.currencyTo
    let limit = req.query.limit
    try {
      let response = await historyService.getListHistoryHour(currency_from, currency_to, limit)
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