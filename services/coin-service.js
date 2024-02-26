const { Coin } = require('../models/coin')
const cloneDataModel = require('./clone-data-service')
const request = require('request')
const config = require('../config/config')
const { Market} = require('../models/market')
const httpclient = require('../http/http-client')
const util = require('../utils/util')
const BigNumber = require('bignumber.js')
const converUtil = require('../utils/convert')

let coinService = {

  async getAllCurrency(role) {
    try {
      let filter = { $or: [ { isDelete: false }, { isDelete: { $exists: false } } ] } 
      if (converUtil.checkAdmin(role)) filter = {}
      return new Promise((resolve, reject) => {
        Coin
          .find(filter, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
          .exec((err, data) => {
            if (err) return reject(err)
            return resolve({ data: data })
          })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },


}

function CoinData(coin) {
  return Coin({
    _id: coin.code,
    code: coin.code,
    price: coin.price,
  })
}

function MarketData(market) {
  return Market({
    _id: market.code,
    code: market.code,
    price: market.price,
  })
}

module.exports = coinService
