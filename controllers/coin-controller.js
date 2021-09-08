const {ResponseData} = require('../helpers/response-data')
const { ResponseDataWithPagination } = require('../helpers/response-data')
const coinService = require('../services/coin-service')

class CoinController {

  listAllCurrency(req, res) {
    let size = req.query.size || 20
    let page = req.query.page || 1
    try {
      let response = coinService.getAllCurrency(size, page)
      return res.json(new ResponseDataWithPagination(true, "", response.data, response.pagination).toJson())
    } catch (err) {
      console.log(err)
      return res.json(new ResponseData(false, err).toJson())
    }
  }

  initCoin(req, res) {
    try {
      coinService.initCoin()
      return res.json(new ResponseDataWithPagination(true, "").toJson())
    } catch (err) {
      console.log(err)
      return res.json(new ResponseData(false, err).toJson())
    }
  }

  addCoin(req, res) {
    return res.json(new ResponseData(true, "",).toJson())
  }

  deleteCoin(req, res) {
    return res.json(new ResponseData(true, "",).toJson())
  }

}

module.exports = new CoinController
