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

  async getBalance() {
    try {
      return new Promise((resolve, reject) => {
        Market.find({}, { _id: 0, __v: 0 ,createdAt: 0, updatedAt: 0,}, (err, data) => {
          if (err) return reject(err)
          return resolve({ data: data })
        })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async getMarketData() {
    try {
      let listCoinData = await Coin.find({ isGetPrice: true }, { _id: 0, _v: 0 })
      let listCoin = []
      if (listCoinData.length) {
        listCoinData.forEach(element => {
          listCoin.push(element.code)
        })
      }
      let response = await cloneDataModel.listSymbolsPrice(listCoin)
      if (response[1]) {
        if (response[1].Response) return
        let listSymbolsPrice = Object.entries(response[1])
        new Map(listSymbolsPrice).forEach((value, key) => {
          let marketData = new MarketData({code: key, price: value.USD })
          Market.findOneAndUpdate({_id: key}, marketData, (err) => {
            if (err) throw err
          })
        })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  addCoin(listCoin) {
    try {
      if (listCoin.length) {
        listCoin.forEach(element => {
          let coin = new CoinData({code: element, price: 0 })
          coin.save((err) => { })
        })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async changeStatusCoin(bodyData) {
    try {
      const code = bodyData.code
      const isDelete = bodyData.isDelete
      if (typeof isDelete === 'boolean')
        return new Promise((resolve, reject) => {
          Coin.findByIdAndUpdate(code.toUpperCase(), { isDelete: isDelete }, (err, result) => {
            if (err) throw err
            else resolve(true)
          })
        })
      return false
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async updateCoin(bodyData) {
    try {
      const coin = bodyData
      return new Promise((resolve, reject) => {
        Coin.findByIdAndUpdate(coin.code, coin, (err, result) => {
          if (err) reject(err)
          else resolve(result)
        })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async changeStatusWithdraw(bodyData) {
    try {
      const code = bodyData.code
      const isWithdrawable = bodyData.isWithdrawable
      if (typeof isWithdrawable === 'boolean')
        return new Promise((resolve, reject) => {
          Coin.findByIdAndUpdate(code.toUpperCase(), { isWithdrawable: isWithdrawable }, (err, result) => {
            if (err) throw err
            else resolve(true)
          })
        })
      return false
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async changeStatusGetPrice(bodyData) {
    try {
      const code = bodyData.code
      const isGetPrice = bodyData.isGetPrice
      if (typeof isGetPrice === 'boolean')
        return new Promise((resolve, reject) => {
          Coin.findByIdAndUpdate(code.toUpperCase(), { isGetPrice: isGetPrice }, (err, result) => {
            if (err) throw err
            else resolve(true)
          })
        })
      return false
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  getFee() {
    try {
      return new Promise((resolve, reject) => {
        Coin
          .find({}, { code: 1, isWithdrawable: 1, feeType: 1, feeFrom: 1, feeFix: 1, feePercent: 1, _id: 0 })
          .exec((err, data) => {
            if (err) return reject(err)
            return resolve(data)
          })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  getCurrencyByCode(code) {
    return new Promise((resolve, reject) => {
      Coin.findOne({ code: code.toUpperCase() }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }
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
