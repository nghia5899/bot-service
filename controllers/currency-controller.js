const { ResponseData } = require('../helpers/response-data')
const currencyService = require('../services/currency-service')

class CurrencyController {

  async addCoupleCurrency(req, res) {
    try {
      var listCoupleCurrency = req.body.listCoupleCurrency
      currencyService.insertCoupleCurrency(listCoupleCurrency)
      return res.json(new ResponseData(true, "Add list couple currency success").toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async deleteCoupleCurrency(req, res) {
    let listCoupleCurrency = req.body.listCoupleCurrency
    try {
      currencyService.deleteCoupleCurrency(listCoupleCurrency)
      return res.json(new ResponseData(true, "Delete success").toJson())
    } catch (e) {
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async getCurrencyByContractAddress(req, res) {
    try {
      let contractAddress = req.query.contractAddress;
      let network = req.query.network;
      if (network == 'tron') {
        let result = await currencyService.getTRC20TokenInfo(contractAddress, network);
        if (result != null) {
          return res.json(new ResponseData(true, "success", result).toJson());
        }
      } else {
        let result = await currencyService.getEthereumTokenInfo(contractAddress, network);
        if (result != null) {
          return res.json(new ResponseData(true, "success", result).toJson());
        }
      }
      return res.json(new ResponseData(false, "Currency information not found").toJson());
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson());
    }
  }
}
module.exports = new CurrencyController
