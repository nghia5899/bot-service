const { Coin } = require('../models/coin')
const { History } = require('../models/history')
const config = require('../config/config')
const binanceService = require('./binance-service');
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
    }
  },
  async getHistoryDeposit() {
    await binance.useServerTime();
    binance.depositHistory(async (error, response) => {
      try {
        if (error) return console.error(error.body);
        const listHistory = await History.find({type: 'deposit'}, {__v: 0 }, {sort: {timeInsert: -1}})
        //check listHistory empty
        if (listHistory) {
          let listNewTransaction = []
          for (let i = 0; i < response.length; i += 1) {
            let check = false
            //check id da ton tai chua
            for (let j = 0; j < listHistory.length; j ++) {
              if (response[i].id == listHistory[j].idTx) {
                check = true
              }
            }
            //chua ton tai add vao list moi
            if (!check) {
              listNewTransaction.push(response[i])
            }
          }
          //xoa data cu thay data moi
          if (listNewTransaction.length > 0) {
            for (let i = 0; i < listNewTransaction.length; i += 1) {
              let messages = 'Deposit: \n'
              messages += 'id: ' + listNewTransaction[i].id +'\n'
              messages += 'coin: ' + listNewTransaction[i].coin +'\n'
              messages += 'amount: ' + listNewTransaction[i].amount +'\n'
              messages += 'address: ' + listNewTransaction[i].address +'\n'
              const date = new Date(listNewTransaction[i].insertTime);
              const time = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${('0'+date.getMinutes()).substr(-2)}:${date.getSeconds()}`
              messages += 'time: ' + time +'\n'
              botLoggerService.sendMessage(messages)
            }
            History.deleteMany({type: 'deposit'}, function(err) {
              if (err) return
              for (let i = 0; i < response.length; i += 1) {
                History({
                  type: 'deposit',
                  idTx: response[i].id,
                  insertTime: response[i].insertTime,
                }).save()
              }
            })
          }
        } else {
          for (let i = 0; i < response.length; i += 1) {
            History({
              type: 'deposit',
              idTx: response[i].id,
              insertTime: response[i].insertTime,
            }).save()
          }
        }
      }  catch(e) {
        console.log(e)
      }
    },
      {
        offset: 0,
        limit: 10,
      }
    )
  },
  async getHistoryWithdraw() {
    await binance.useServerTime();
    binance.withdrawHistory(async (error, response) => {
      console.info(response);
      const listHistory = await History.find({type: 'withdraw'}, {__v: 0 }, {sort: {timeInsert: -1}})
      //check listHistory empty
      if (listHistory) {
        let listNewTransaction = []
        for (let i = 0; i < response.length; i += 1) {
          let check = false
          //check id da ton tai chua
          for (let j = 0; j < listHistory.length; j += 1) {
            if (response[i].id == listHistory[j].idTx) {
              check = true
            }
          }
          //chua ton tai add vao list moi
          if (!check) {
            listNewTransaction.push(response[i])
          }
        }
        //xoa data cu thay data moi
        if (listNewTransaction.length > 0) {
          for (let i = 0; i < listNewTransaction.length; i += 1) {
            let messages = 'Withdraw: \n'
            messages += 'id: ' + listNewTransaction[i].id +'\n'
            messages += 'coin: ' + listNewTransaction[i].coin +'\n'
            messages += 'amount: ' + listNewTransaction[i].amount +'\n'
            messages += 'address: ' + listNewTransaction[i].address +'\n'
            messages += 'time: ' + listNewTransaction[i].completeTime +'\n'
            botLoggerService.sendMessage(messages)
            console.log('bot send', listNewTransaction[i].id)
          }
          History.deleteMany({type: 'withdraw'}, function(err) {
            if (err) return
            for (let i = 0; i < response.length; i += 1) {
              History({
                type: 'withdraw',
                idTx: response[i].id,
                insertTime: Date.parse(response[i].completeTime),
              }).save()
            }
          })
        }
      } else {
        for (let i = 0; i < response.length; i += 1) {
          History({
            type: 'withdraw',
            idTx: response[i].id,
            insertTime: response[i].insertTime,
          }).save()
        }
      }
    },
    {
      offset: 0,
      limit: 10
    }
    ) 
  },
  async accountSnapshot() {
    const time = await binance.useServerTime();
    console.log(time)
    const res = await binanceService.getHistoryTransfer(time.serverTime)
    console.log(res.data)
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
