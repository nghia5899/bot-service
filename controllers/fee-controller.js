const { default: RangeSet } = require('ripple-lib/dist/npm/common/rangeset')
const {ResponseData} = require('../helpers/response-data')
const feeService = require('../services/fee-service')
const util = require('../utils/util')
const botLoggerService = require('../services/bot-logger-service')
const logger = require('../helpers/logger')('FeeController')

module.exports = {
  getXrpFee: function (req, res) {
    feeService.getFee(req.body.code.toUpperCase()).then(async rs => {
      const response = rs
      try {
        const feeData = await feeService.getXrpFee(req.body)
        response.feeFix = parseFloat(feeData)
      } catch (e) {
        response.feeFix = e
        botLoggerService.sendMessage(logger(e.message))
      }
      response.minimunBalance = 0
      res.json(new ResponseData(true, '', response).toJson())
    }).catch(e => {
      console.log(e)
      botLoggerService.sendMessage(logger(e.message))
      res.json(new ResponseData(false, null, e.message).toJson())
    })
  },
  getFee: function(req, res) {
    let code = req.query.networkType || req.query.code
    code = code.toUpperCase()
	  feeService.getFee(code.toUpperCase()).then(async rs => {
      const response = rs || {}
      switch (code) {
        case 'TRC20':
          response.minimunBalance = util.generateMinimumBalance(req.query.precision || 1)
          response.maxFee = 10
          break
        case 'ETH': case 'ERC20':
          try {
            const feeData = await feeService.getEthFeeWithCode(code)
            let ethFee = util.dividedBy(feeData, 1000000000)
            ethFee = util.multipliedBy(ethFee, 21000)
            ethFee = util.dividedBy(ethFee, 1000000000)
            ethFee = util.roundUp(ethFee, 6)
            response.feeFix = ethFee

            let maxFee = util.dividedBy(feeData, 1000000000)
            maxFee = util.multipliedBy(maxFee, 150000)
            maxFee = util.dividedBy(maxFee, 1000000000)
            maxFee = util.roundUp(maxFee, 6)
            response.maxFee = maxFee
          } catch (e) {
            response.feeFix = e
            botLoggerService.sendMessage(logger(e.message))
          }
          break
        case 'BSC': case 'BEP20':
          try {
            const feeData = await feeService.getEthFeeWithCode(code)
            let ethFee = util.dividedBy(feeData, 1000000000)
            ethFee = util.multipliedBy(ethFee, 21000)
            ethFee = util.dividedBy(ethFee, 1000000000)
            ethFee = util.roundUp(ethFee, 6)
            response.feeFix = ethFee

            let maxFee = util.dividedBy(feeData, 1000000000)
            maxFee = util.multipliedBy(maxFee, 150000)
            maxFee = util.dividedBy(maxFee, 1000000000)
            maxFee = util.roundUp(maxFee, 6)
            response.maxFee = maxFee
          } catch (e) {
            response.feeFix = e
            botLoggerService.sendMessage(logger(e.message))
          }
          break
        case 'MATIC':
          try {
            const feeData = await feeService.getEthFeeWithCode(code)
            let ethFee = util.dividedBy(feeData, 1000000000)
            ethFee = util.multipliedBy(ethFee, 21000)
            ethFee = util.dividedBy(ethFee, 1000000000)
            ethFee = util.roundUp(ethFee, 6)
            response.feeFix = ethFee

            let maxFee = util.dividedBy(feeData, 1000000000)
            maxFee = util.multipliedBy(maxFee, 150000)
            maxFee = util.dividedBy(maxFee, 1000000000)
            maxFee = util.roundUp(maxFee, 6)
            response.maxFee = maxFee
          } catch (e) {
            response.feeFix = e
            botLoggerService.sendMessage(logger(e.message))
          }
          break
        case 'ETC':
          try {
            const feeData = await feeService.getEthFeeWithCode(code)
            let ethFee = util.dividedBy(feeData, 1000000000)
            ethFee = util.multipliedBy(ethFee, 21000)
            ethFee = util.dividedBy(ethFee, 1000000000)
            ethFee = util.roundUp(ethFee, 6)
            response.feeFix = ethFee

            let maxFee = util.dividedBy(feeData, 1000000000)
            maxFee = util.multipliedBy(maxFee, 150000)
            maxFee = util.dividedBy(maxFee, 1000000000)
            maxFee = util.roundUp(maxFee, 6)
            response.maxFee = maxFee
          } catch (e) {
            response.feeFix = e
            botLoggerService.sendMessage(logger(e.message))
          }
          break
        case 'AURORA': case 'AURORA_ERC20':
          try {
            const feeData = await feeService.getEthFeeWithCode(code)
            let ethFee = util.dividedBy(feeData, 1000000000)
            ethFee = util.multipliedBy(ethFee, 21000)
            ethFee = util.dividedBy(ethFee, 1000000000)
            ethFee = util.roundUp(ethFee, 6)
            response.feeFix = ethFee

            let maxFee = util.dividedBy(feeData, 1000000000)
            maxFee = util.multipliedBy(maxFee, 150000)
            maxFee = util.dividedBy(maxFee, 1000000000)
            maxFee = util.roundUp(maxFee, 6)
            response.maxFee = maxFee
          } catch (e) {
            response.feeFix = e
            botLoggerService.sendMessage(logger(e.message))
          }
          break
        case 'KCS':
          try {
            const feeData = await feeService.getEthFeeWithCode(code)
            let ethFee = util.dividedBy(feeData, 1000000000)
            ethFee = util.multipliedBy(ethFee, 21000)
            ethFee = util.dividedBy(ethFee, 1000000000)
            ethFee = util.roundUp(ethFee, 6)
            response.feeFix = ethFee

            let maxFee = util.dividedBy(feeData, 1000000000)
            maxFee = util.multipliedBy(maxFee, 150000)
            maxFee = util.dividedBy(maxFee, 1000000000)
            maxFee = util.roundUp(maxFee, 6)
            response.maxFee = maxFee
          } catch (error) {
            response.feeFix = error
          }
          break
        case 'KAI': case 'KRC20':
          try {
            const feeData = await feeService.getEthFeeWithCode(code)
            let ethFee = util.dividedBy(feeData, 1000000000)
            ethFee = util.multipliedBy(ethFee, 21000)
            ethFee = util.dividedBy(ethFee, 1000000000)
            ethFee = util.roundUp(ethFee, 6)
            response.feeFix = ethFee

            let maxFee = util.dividedBy(feeData, 1000000000)
            maxFee = util.multipliedBy(maxFee, 150000)
            maxFee = util.dividedBy(maxFee, 1000000000)
            maxFee = util.roundUp(maxFee, 6)
            response.maxFee = maxFee
          } catch (error) {
            response.feeFix = error
          }
          break
        case 'XLM':
          const feeData = feeService.getXlmFee()
          response.feeFix = util.dividedBy(feeData, 10000000)
          response.maxFee = util.dividedBy(feeData, 10000000) * 2
          break
        default:
          response.minimunBalance = 0
          break
      }

      res.json(new ResponseData(true, '', response).toJson())
    }).catch(e => {
      console.log(e)
      botLoggerService.sendMessage(logger(e.message))
      res.json(new ResponseData(false, null, e.message).toJson())
    })
  }
}
