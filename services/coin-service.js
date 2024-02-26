const { Coin } = require('../models/coin')
const request = require('request')
const config = require('../config/config')
const httpclient = require('../http/http-client')
const util = require('../utils/util')
const BigNumber = require('bignumber.js')
const converUtil = require('../utils/convert')

const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: 'wnyiHvwuGLqP7dRzETQQmVYLuJCja7bLoqsa91QefHU3LTkFjyws0TxmIo1GsOin',
  APISECRET: 'RL6tdabBjxqBebMuBRKJA8lbWhVvzX9WiSMChd06Rw7ZquMkcXGjTRnVQl8Q3xhA',
  'family': 4,
  'tld':'us',
  useServerTime: true,
  recvWindow: 5000, // Set a higher recvWindow to increase response timeout
  verbose: true, // Add extra output when subscribing to WebSockets, etc
  log: log => {
    console.log(log); // You can create your own logger here, or disable console output
  }
});

let coinService = {
  async getBalance() {
    try {
      binance.balance((error, balances) => {
        if (error) return console.error(error);
        console.info("ETH balance: ", balances);
      });
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
