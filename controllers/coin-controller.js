const { ResponseData, ResponseDataWithPagination } = require('../helpers/response-data')
const coinService = require('../services/coin-service')

class CoinController {

  async listAllCoin(req, res) {
    try {
      const role = req.query.role
      let response = await coinService.getAllCurrency(role)
      return res.json(new ResponseData(true, "", response.data).toJson())
    } catch (err) {
      console.log(err)
      return res.json(new ResponseData(false, err).toJson())
    }
  }

  async listCoinBalance(req, res) {
    try {
      let response = await coinService.getBalance()
      return res.json(new ResponseData(true, "", response.data).toJson())
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

  async changeStatusCoin(req, res) {
    try {
      const result = await coinService.changeStatusCoin(req.body)
      if (result)
        return res.json(new ResponseData(true, 'Change status coin success',).toJson())
      else
        return res.json(new ResponseData(false, 'Some thing error').toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async updateCoin(req, res) {
    try {
      await coinService.updateCoin(req.body)
      return res.json(new ResponseData(true, 'Update success',).toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async changeStatusWithdraw(req, res) {
    try {
      const result = await coinService.changeStatusWithdraw(req.body)
      if (result)
        return res.json(new ResponseData(true, 'Change status withdraw success',).toJson())
      else
        return res.json(new ResponseData(false, 'Some thing error').toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async changeStatusGetPrice(req, res) {
    try {
      const result = await coinService.changeStatusGetPrice(req.body)
      if (result)
        return res.json(new ResponseData(true, 'Change status get price success',).toJson())
      else
        return res.json(new ResponseData(false, 'Some thing error').toJson())
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
