const { Coin } = require('../models/coin')
const { History } = require('../models/history')
const { Wallet } = require('../models/wallet')
const config = require('../config/config')
const binanceService = require('./binance-service');
const Binance = require('node-binance-api');
const botLoggerService = require('../bot/bot-logger-service');
const { Config } = require('../models/config');
const { list } = require('pm2');
const { resolve } = require('path');
const { match } = require('assert');

const coinService = {
   async calculate(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = req.body
        console.log(req.body)
        const time = data.time
        const id = data.id
        const result = (id * time) % id
        return resolve(result)
      } catch (e) {
        return resolve({status: false, message: 'Error'})
      }
    })
  },
}

module.exports = coinService
