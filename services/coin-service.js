const { Coin } = require('../models/coin')
const { History } = require('../models/history')
const { Wallet } = require('../models/wallet')
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
  async addWallet(req) {
    return new Promise(async function(resolve, reject) {
      try {
        const listWallet = req.body.listWallet
        for (let i = 0; i < listWallet.length; i += 1) {
          const response = await Wallet({
            name: listWallet[i].name,
            api_key: listWallet[i].api_key,
            api_secret: listWallet[i].api_secret,
            status: true,
          }).save()
        }
        const list = await Wallet.find({}, {__v: 0 , createdAt: 0, updatedAt: 0})
        return resolve(list)
      } catch (e) {
        console.log(e)
        console.log(logger(e))
        return resolve(false)
      }
    })
  },
  async accountSnapshot() {
    const time = await binance.useServerTime();
    console.log(time)
    const res = await binanceService.getHistoryTransfer(time.serverTime)
    console.log(res.data)
  },
  BinaceOption(wallet) {
    const binance = new Binance().options({
      APIKEY: wallet.api_key,
      APISECRET: wallet.api_secret,
      'family': 4,
      'tld':'us',
      useServerTime: true,
      recvWindow: 5000, // Set a higher recvWindow to increase response timeout
      verbose: true, // Add extra output when subscribing to WebSockets, etc
      log: log => {
        console.log(log); // You can create your own logger here, or disable console output
      }
    });
    return {
      getBalance: async function() {
        try {
          const time = await binance.useServerTime();
          const balances = await binance.balance()
          const balancesFunding = await binanceService.getHistoryTransfer(time.serverTime)
          console.log(balancesFunding)
          console.log('------ getBalance ------')
          console.log('-----> Success')
          let messages = `Name: ${wallet.name} \n` + 'Balances: \n'
          const listCoin = config.LIST_COIN
          for (let i = 0; i < listCoin.length; i += 1) {
            const coin = listCoin[i]
            let total = 0
            messages += 'Coin: ' + coin + '\n'
            if (balances) {
              const coinData = await Coin.findOne({code: coin, idWallet: wallet.id, typeWallet: 'spot'})
              messages += '-Spot: ' + balances[coin].available + '\n'
              total += parseFloat(balances[coin].available)
              if (coinData) {
                let update = {
                  amount: balances[coin].available
                }
                Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'spot'}, update,{ new: true}, function(err) {
                  if (err) console.log(err)
                })
              } else {
                Coin({
                  idWallet: wallet.id,
                  typeWallet: 'spot',
                  code: coin,
                  amount: balances[coin].available,
                }).save()
              }
            }

            if (balancesFunding.data && balancesFunding.data.length > 0) {
              const coinDataFunding = await Coin.findOne({code: coin, idWallet: wallet.id, typeWallet: 'funding'})
              const asset = balancesFunding.data.find(x => x.asset === coin)
              console.log(Boolean(asset))
              if (!asset) {
                messages += '-Funding: 0' + '\n'
                Coin({
                  idWallet: wallet.id,
                  typeWallet: 'funding',
                  code: coin,
                  amount: 0,
                }).save()
              } else {
                messages += '-Funding: ' + asset.free + '\n'
                total += parseFloat(asset.free)
                if (coinDataFunding) {
                  let update = {
                    amount: asset.free
                  }
                  Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'funding'}, update,{ new: true}, function(err) {
                    if (err) console.log(err)
                  })
                } else {
                  Coin({
                    idWallet: wallet.id,
                    typeWallet: 'funding',
                    code: coin,
                    amount: asset.available,
                  }).save()
                }
              }
            }
            messages += '-Total: ' + total + '\n'

          }
  
          botLoggerService.sendMessage(messages, wallet.status)
        } catch (e) {
          console.log(e)
          console.log('-----> Fail')
        }
      },
      checkBalance: async function() {
        try {
          const time = await binance.useServerTime();
          let listNewBalance = []
          const listCoin = config.LIST_COIN
          const balances = await binance.balance()
          const balancesFunding = await binanceService.getHistoryTransfer(time.serverTime)
          console.log('------ checkBalance ------')
          if (!balances) return
          console.log('-----> Success')
          const listCoinHistory = await Coin.find({idWallet: wallet.id, typeWallet: 'spot'})
          const listCoinHistoryFunding = await Coin.find({idWallet: wallet.id, typeWallet: 'funding'})
          let messages = `Wallet: ${wallet.name} \n` + 'Balance change: \n'
          for (let i = 0; i < listCoin.length; i += 1) {
            const coin = listCoin[i]
            console.log(coin)
            let total = 0
            let checkSend = false
            if (balances) {
              let oldBalance = 0
              let check = false
              for (let j = 0; j < listCoinHistory.length; j++) {
                if (coin == listCoinHistory[j].code) {
                  if (parseFloat(balances[coin].available) != listCoinHistory[j].amount) {
                    check = true
                    oldBalance = listCoinHistory[j].amount
                    break
                  }
                }
              }
              messages += 'Coin: ' + coin +'\n'
              messages += '-Type: Spot' +'\n'
              messages += '-OldAmount: ' + oldBalance +'\n'
              messages += '-NewAmount: ' + parseFloat(balances[coin].available) +'\n'
              total += parseFloat(balances[coin].available)
              if (check) {
                checkSend = true
                let update = {
                  amount: balances[coin].available
                }
                Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'spot'}, update,{ new: true}, function(err) {
                  if (err) console.log(err)
                })
              }
            }

            if (balancesFunding.data && balancesFunding.data.length > 0) {
              const asset = balancesFunding.data.find(x => x.asset === coin)
              if (asset) {
                let oldBalance = 0
                let check = false
                for (let j = 0; j < listCoinHistoryFunding.length; j++) {
                  if (coin == listCoinHistoryFunding[j].code) {
                    if (parseFloat(asset.free) != listCoinHistoryFunding[j].amount) {
                      check = true
                      oldBalance = listCoinHistoryFunding[j].amount
                      break
                    }
                  }
                }
                messages += '-Type: Funding' +'\n'
                messages += '-OldAmount: ' + oldBalance +'\n'
                messages += '-NewAmount: ' + asset.free +'\n'
                total += parseFloat(asset.free)
                if (check) {
                  checkSend = true
                  let update = {
                    amount: parseFloat(asset.free)
                  }
                  Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'funding'}, update,{ new: true}, function(err) {
                    if (err) console.log(err)
                  })
                }
              }
            }
            messages += 'Total: ' + total + '\n'
            if (checkSend) {
              botLoggerService.sendMessage(messages, wallet.status)
            }
          }
        } catch (e) {
          console.log(e)
        }
      },
      getHistoryDeposit: async function() {
        await binance.useServerTime();
        binance.depositHistory(async (error, response) => {
          console.log('------ getHistoryDeposit ------', wallet.id)
          if (error) {
            console.log(error)
            return
          }
          console.log('-----> Success')
          try {
            if (error) return console.error(error.body);
            const listHistory = await History.find({type: 'deposit', idWallet: wallet.id}, {__v: 0 }, {sort: {timeInsert: -1}})
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
                  try {
                    let messages = `Wallet: ${wallet.name} \n` + 'Deposit: \n'
                    messages += 'coin: ' + listNewTransaction[i].coin +'\n'
                    messages += 'amount: +' + listNewTransaction[i].amount +'\n'
                    botLoggerService.sendMessage(messages, wallet.status)
                  } catch (e) {
                    console.log(e)
                  }
                }
                History.deleteMany({type: 'deposit', idWallet: wallet.id},async function(err) {
                  console.log(err)
                  if (err) return
                  for (let i = 0; i < response.length; i += 1) {
                    const res = await History({
                      type: 'deposit',
                      idTx: response[i].id,
                      insertTime: response[i].insertTime,
                      idWallet: wallet.id
                    }).save()
                    console.log(res)
                  }
                })
              }
            } else {
              for (let i = 0; i < response.length; i += 1) {
                const res = History({
                  type: 'deposit',
                  idTx: response[i].id,
                  insertTime: response[i].insertTime,
                  idWallet: wallet.id
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
      getHistoryWithdraw: async function() {
        await binance.useServerTime();
        binance.withdrawHistory(async (error, response) => {
          console.log('------ getHistoryWithdraw ------', wallet.id)
          if (error) {
            console.log(error)
            return
          }
          console.log('-----> Success')
          try {
            const listHistory = await History.find({type: 'withdraw', idWallet: wallet.id}, {__v: 0 }, {sort: {timeInsert: -1}})
            //check listHistory empty
            if (listHistory && listHistory.length != 0) {
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
                if (!check && response[i].status == 6) {
                  listNewTransaction.push(response[i])
                }
              }
              //xoa data cu thay data moi
              if (listNewTransaction.length > 0) {
                for (let i = 0; i < listNewTransaction.length; i += 1) {
                  let messages =  `Wallet: ${wallet.name} \n` +'Withdraw: \n'
                  messages += 'coin: ' + listNewTransaction[i].coin +'\n'
                  messages += 'amount: -' + listNewTransaction[i].amount +'\n'
                  botLoggerService.sendMessage(messages, wallet.status)
                }
                History.deleteMany({type: 'withdraw', idWallet: wallet.id}, function(err) {
                  if (err) return
                  for (let i = 0; i < response.length; i += 1) {
                    History({
                      type: 'withdraw',
                      idTx: response[i].id,
                      insertTime: Date.parse(response[i].completeTime),
                      idWallet: wallet.id
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
                  idWallet: wallet.id
                }).save()
              }
            }
          } catch (e) {
            console.log(e)
          }
        },
        {
          offset: 0,
          limit: 10
        }
        ) 
      }
    }
  },
 test: async function () {
    binanceService.getHistoryTransfer()
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
