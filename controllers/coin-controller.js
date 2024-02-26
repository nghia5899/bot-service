const { ResponseData, ResponseDataWithPagination } = require('../helpers/response-data')
const coinService = require('../services/coin-service')
const botLoggerService = require('../services/bot-logger-service')


class CoinController {

  async listAllCoin(req, res) {
    try {
      let response = await coinService.getBalance()
      return res.json(new ResponseData(true, "", response.data).toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }
}

module.exports = new CoinController
