const { ResponseData, ResponseDataWithPagination } = require('../helpers/response-data')
const coinService = require('../services/coin-service')

class CoinController {

  async listAllCoin(req, res) {
    try {
      let response = await coinService.getAllCurrency()
      return res.json(new ResponseData(true, "", response.data).toJson())
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
    try {
      let listCoin = req.body.listCoin
      coinService.addCoin(listCoin)
      return res.json(new ResponseData(true, "",).toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  deleteCoin(req, res) {
    try {
      let listCoin = req.body.listCoin
      coinService.deleteCoin(listCoin)
      return res.json(new ResponseData(true, "",).toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async feeWithdraw(req, res) {
    try {
      let response = await coinService.getFee()
      return res.json(new ResponseData(true, "", response).toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async getCurrencyByCode(req, res) {
    try {
      let response = await coinService.getCurrencyByCode(req.query.code)
      return res.json(new ResponseData(true, '', response).toJson())
    } catch (error) {
      return res.json(new ResponseData(false, error).toJson())
    }
  }

  async getListTransactions(req, res) {
    try {
      let address = req.query.address;
      let code = req.query.code;
      let contractAddress = req.query.contractAddress;
      let network = req.query.network;
      let page = req.query.page;
      let size = req.query.size;
      let fingerprint = req.query.fingerprint;
      let response = await coinService.getListTransactions(address, code, contractAddress, network, page, size, fingerprint);
      return res.json(new ResponseData(true, 'Success', response).toJson());
    } catch (error) {
      return res.json(new ResponseData(false, error).toJson())
    }
  }

}

module.exports = new CoinController
