const { ResponseData } = require('../helpers/response-data')
const currencyService = require('../services/currency-service')
const WAValidator = require('@swyftx/api-crypto-address-validator')
const botLoggerService = require('../services/bot-logger-service')
const logger = require('../helpers/logger')('CurrencyController')

class CurrencyController {

  async getAllCoupleCurrency(req, res) {
    try {
      let response = await currencyService.getAllCoupleCurrency()
      return res.json(new ResponseData(true, null, response.data).toJson())
    } catch (e) {
      console.log(e)
      botLoggerService.sendMessage(logger(e.message))
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async addCoupleCurrency(req, res) {
    try {
      var listCoupleCurrency = req.body.listCoupleCurrency
      currencyService.insertCoupleCurrency(listCoupleCurrency)
      return res.json(new ResponseData(true, "Add list couple currency success").toJson())
    } catch (e) {
      console.log(e)
      botLoggerService.sendMessage(logger(e.message))
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async deleteCoupleCurrency(req, res) {
    let listCoupleCurrency = req.body.listCoupleCurrency
    try {
      currencyService.deleteCoupleCurrency(listCoupleCurrency)
      return res.json(new ResponseData(true, "Delete success").toJson())
    } catch (e) {
      botLoggerService.sendMessage(logger(e.message))
      return res.json(new ResponseData(false, e).toJson())
    }
  }

  async getCurrencyByContractAddress(req, res) {
    try {
      let contractAddress = req.query.contractAddress;
      let network = req.query.network;
      if (network == 'tron' || network === 'trc20') {
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
      botLoggerService.sendMessage(logger(e.message))
      return res.json(new ResponseData(false, e).toJson());
    }
  }

  async validateAddress(req, res) {
    try {
      let address = req.body.address;
      let currencySymbol = req.body.currencySymbol;
      let network = req.body.network;
      const valid = WAValidator.validate(address, currencySymbol, network);
      if (valid) {
        return res.json(new ResponseData(true, "This is a valid address", true).toJson());
      } else {
        // Address INVALID
        return res.json(new ResponseData(false, "This is a invalid address", false).toJson());
      }
    } catch (e) {
      console.log(e)
      botLoggerService.sendMessage(logger(e.message))
      // Can not validate Address
      return res.json(new ResponseData(true, "Can not validate Address", true).toJson());
    }
  }
}
module.exports = new CurrencyController
