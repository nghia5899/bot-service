const { ResponseData, ResponseDataWithPagination } = require('../helpers/response-data')
const coinService = require('../services/coin-service')

class CoinController {

  async calculate(req, res) {
    try {
      let response = await coinService.calculate(req)
      return res.json(new ResponseData(true, "", response).toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }
  
  async sign(req, res) {
    try {
      let response = await coinService.sign(req)
      if (response.status)
        return res.json(new ResponseData(true, "", response.data).toJson())
      else 
        return res.json(new ResponseData(false, response.message).toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }
}

module.exports = new CoinController
