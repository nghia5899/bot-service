const { Coin } = require('../models/coin')
const config = require('../config/config')

const Binance = require('node-binance-api');
const botLoggerService = require('./bot-logger-service');

const binance = new Binance().options({
  APIKEY: config.API_KEY,
  APISECRET: config.API_SECRET,
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
      await binance.useServerTime();
      binance.balance(async (error, balances) => {
        if (error) return console.error(error);
        let messages = 'Balances: \n'
        const listCoin = config.LIST_COIN
        for (let i = 0; i < listCoin.length; i += 1) {
          const coin = listCoin[i]
          const message = `${coin}: ${balances[coin].available}`
          const coinData = await Coin.findOne({code: coin})
          if (coinData) {
            let update = {
              amount: balances[coin].available
            }
            Coin.findOneAndUpdate({code: coin}, update,{ new: true})
          } else {
            Coin({
              code: coin,
              amount: balances[coin].available,
            }).save()
          }

          messages += message +'\n'
          console.info(`${coin}: ${balances[coin].available}`);
        }

        botLoggerService.sendMessage(messages)
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
