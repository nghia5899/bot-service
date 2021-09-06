const apiResponse = require('../helpers/apiResponse')
const coinService = require('../services/coin_service')

class CoinController {

  listAllCurrency(req, res) {
    let size = req.query.size || 20
    let page = req.query.page || 1
    try {
      let response = coinService.getAllCurrency(size, page)
      apiResponse.successResponseWithPagination(res, "", response.data, response.pagination)
    } catch (err) {
      console.log(err)
      apiResponse.ErrorResponse(res, "Error")
    }
  }

  initCoin(req, res) {
    try {
      coinService.initCoin()
      apiResponse.successResponse(res, "init Coin success")
    } catch (err) {
      console.log(err)
      apiResponse.ErrorResponse(res, "Error")
    }
  }

  addCoin(req, res) {
    res.json({
      status: 'post'
    })
  }

  deleteCoin(req, res) {
    res.json({
      status: 'delete'
    })
  }

}

module.exports = new CoinController
