const apiResponse = require('../helpers/apiResponse')
const currencyService = require('../services/currency_service')

class CurrencyController {

  async addCoupleCurrency(req, res) {
    try {
      var listCoupleCurrency = req.body.listCoupleCurrency
      currencyService.insertCoupleCurrency(listCoupleCurrency)
      return apiResponse.successResponse(res, "Add list couple currency success")
    } catch (e) {
      console.log(e)
      return apiResponse.ErrorResponse(res, e.toString())
    }
  }

  async deleteCoupleCurrency(req, res) {
    let listCoupleCurrency = req.body.listCoupleCurrency
    try {
      currencyService.deleteCoupleCurrency(listCoupleCurrency)
      return apiResponse.successResponse(res, "Delete success")
    } catch (e) {
      return apiResponse.ErrorResponse(res, "Delete list couple currency success")
    }
  }
}


module.exports = new CurrencyController
