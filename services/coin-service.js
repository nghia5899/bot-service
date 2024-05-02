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

const coinService = {
   async enableWallet(strings) {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = await Wallet.findOne({_id: strings[0]})
        if (!wallet) {
          return resolve({status: false, message: 'Ví không đúng'})
        }
        await Wallet.findOneAndUpdate({_id: strings[0]}, {status: true}, function(err) {
          if (err) console.log(err)
          return resolve({status: true})
        })
      } catch (e) {
        return resolve({status: false, message: 'Ví không đúng'})
      }
    })
  },
  disableWallet(strings) {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = await Wallet.findOne({_id: strings[0]})
        if (!wallet) {
          return resolve({status: false, message: 'Ví không đúng'})
        }
        await Wallet.findOneAndUpdate({_id: strings[0]}, {status: false}, function(err) {
          if (err) console.log(err)
          return resolve({status: true})
        })
      } catch (e) {
        return resolve({status: false, message: 'Ví không đúng'})
      }
    })
  },
  async enableBalanceChange(strings) {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = await Wallet.findOne({_id: strings[0]})
        if (!wallet) {
          return resolve({status: false, message: 'Ví không đúng'})
        }
        await Wallet.findOneAndUpdate({_id: strings[0]}, {statusChange: true}, function(err) {
          if (err) console.log(err)
          return resolve({status: true})
        })
      } catch (e) {
        return resolve({status: false, message: 'Ví không đúng'})
      }
    })
  },
  disableBalanceChange(strings) {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = await Wallet.findOne({_id: strings[0]})
        if (!wallet) {
          return resolve({status: false, message: 'Ví không đúng'})
        }
        console.log('disableBalanceChange')
        await Wallet.findOneAndUpdate({_id: strings[0]}, {statusChange: false}, function(err) {
          if (err) console.log(err)
          return resolve({status: true})
        })
      } catch (e) {
        return resolve({status: false, message: 'Ví không đúng'})
      }
    })
  },
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
            statusBalanceChange: true,
          }).save()
        }
        const list = await Wallet.find({}, {__v: 0 , createdAt: 0, updatedAt: 0})
        return resolve(list)
      } catch (e) {
        console.log(e)
        return resolve(false)
      }
    })
  },
  async addWalletFromBot(wallet) {
    return new Promise(async function(resolve, reject) {
      try {
        const response = await Wallet({
          name: wallet.name,
          api_key: wallet.api_key,
          api_secret: wallet.api_secret,
          status: true,
          statusBalanceChange: true,
        }).save()
        if (!response) return resolve({status: false, message: 'Lỗi'})
        const listCoin = config.LIST_COIN
        for (let i = 0; i < listCoin.length; i += 1) {
          Coin({
            idWallet: response.id,
            typeWallet: 'spot',
            code: listCoin[i],
            amount: 0,
          }).save()
          Coin({
            idWallet: response.id,
            typeWallet: 'funding',
            code: listCoin[i],
            amount: 0,
          }).save()
        }
        return resolve({status: true})
      } catch (e) {
        console.log(e)
        return resolve({status: false, message: 'Ví không đúng'})
      }
    })
  },
  async deleteWalletFromBot(wallet) {
    return new Promise(async function(resolve, reject) {
      try {
        Wallet.findOneAndDelete({_id: wallet.id} , function (err, docs) { 
          if (err){ 
            console.log(err) 
            return resolve({status: false, message: 'Lỗi'})
          }
          return resolve({status: true})
        }); 
        Coin.deleteMany({idWallet: wallet.id},async function(err) {
          if (err){ 
            console.log(err) 
          }
          return resolve({status: true})
        })
      } catch (e) {
        console.log(e)
        return resolve({status: false, message: 'Ví không đúng'})
      }
    })
  },
  async updateWalletFromBot(wallet) {
    return new Promise(async function(resolve, reject) {
      try {
        Wallet.findOneAndUpdate({_id: wallet.id}, wallet, function (err, docs) { 
          if (err){ 
            console.log(err) 
            return resolve({status: false, message: 'Lỗi'})
          }
          return resolve({status: true})
        }); 
      } catch (e) {
        console.log(e)
        return resolve({status: false, message: 'Ví không đúng'})
      }
    })
  },
  async listWalletFromBot() {
    return new Promise(async function(resolve, reject) {
      try {
        const listWallet = await Wallet.find({})
        if (listWallet) {
          return resolve({status: true, wallets: listWallet})
        } else {
          return resolve({status: false, message: 'Không tìm thấy ví nào'})
        }
      } catch (e) {
        console.log(e)
        return resolve({status: false, message: 'Ví không đúng'})
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
      getBalance: async function(ctx) {
        return new Promise(async (resolve, reject) => {
          try {
            let totalBalance = {}
            const time = await binance.useServerTime();
            let balances
            let balancesFunding
            let balancesEarn
            try {
              balances = await binance.balance()
            } catch (e) {
  
            }
            try {
              balancesFunding = await binanceService.getBalanceFunding(time.serverTime, wallet)
            } catch (e) {
  
            }
            try {
              balancesEarn = await binanceService.getBalanceEarn(time.serverTime, wallet)
            } catch (e) {
  
            }
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
                messages += '-Spot: ' + Math.floor(balances[coin].available) + '\n'
                total += Math.floor(parseFloat(balances[coin].available))
                if (coinData) {
                  let update = {
                    amount: balances[coin].available
                  }
                  Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'spot'}, update, function(err) {
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
              } else {
                messages += '-Spot: 0' + '\n'
              }
              
              if (balancesFunding) {
                try {
                  const coinDataFunding = await Coin.findOne({code: coin, idWallet: wallet.id, typeWallet: 'funding'})
                  console.log(coinDataFunding)
                  const asset = balancesFunding.find(x => x.asset === coin)
                  if (!asset) {
                    messages += '-Funding: 0' + '\n'
                    if (!coinDataFunding) {
                      Coin({
                        idWallet: wallet.id,
                        typeWallet: 'funding',
                        code: coin,
                        amount: 0,
                      }).save()
                    }
                  } else {
                    messages += '-Funding: ' + Math.floor(parseFloat(asset.free)) + '\n'
                    total += Math.floor(parseFloat(asset.free))
                    if (coinDataFunding) {
                      let update = {
                        amount: asset.free
                      }
                      Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'funding'}, update, function(err) {
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
                } catch(e) {
                  console.log(e)
                }
              } else {
                messages += '-Funding: 0' + '\n'
              }

              if (balancesEarn) {
                const coinDataEarn = await Coin.findOne({code: coin, idWallet: wallet.id, typeWallet: 'earn'})
                messages += '-Earn: ' + Math.floor(parseFloat(balancesEarn.totalAmountInUSDT)) + '\n'
                total += Math.floor(parseFloat(balancesEarn.totalAmountInUSDT))
                if (coinDataEarn) {
                  let update = {
                    amount: balancesEarn.totalAmountInUSDT
                  }
                  Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'spot'}, update, function(err) {
                    if (err) console.log(err)
                  })
                } else {
                  Coin({
                    idWallet: wallet.id,
                    typeWallet: 'earn',
                    code: coin,
                    amount: balancesEarn.totalAmountInUSDT,
                  }).save()
                }
              } else {
                messages += '-Earn: 0' + '\n'
              }

              messages += '-Total: ' + total + '\n'
              totalBalance[coin] = total
            }
            if (ctx) {
              console.log(ctx)
              const chatId = ctx.message.chat.id
              ctx.telegram.sendMessage(chatId, messages)
            } else {
              console.log('send')
              botLoggerService.sendMessage(messages, wallet.status)
            }
            return resolve(totalBalance)
          } catch (e) {
            console.log(e)
            console.log('-----> Fail')
            return resolve([])
          }
        })
      },
      checkBalance: async function() {
        return new Promise(async (resolve, reject) => {
          try {
            let totalBalance = {
              checkSend: false,
            }
            const time = await binance.useServerTime();
            const listCoin = config.LIST_COIN
            let balances
            let balancesFunding
            let balancesEarn
            try {
              balances = await binance.balance()
            } catch (e) {
  
            }

            try {
              balancesFunding = await binanceService.getBalanceFunding(time.serverTime, wallet)
            } catch (e) {
  
            }
            try {
              balancesEarn = await binanceService.getBalanceEarn(time.serverTime, wallet)
            } catch (e) {
  
            }
            console.log('------ checkBalance ------')
            console.log('-----> Success')
            const listCoinHistory = await Coin.find({idWallet: wallet.id, typeWallet: 'spot'})
            const listCoinHistoryFunding = await Coin.find({idWallet: wallet.id, typeWallet: 'funding'})
            const listCoinHistoryEarn = await Coin.find({idWallet: wallet.id, typeWallet: 'earn'})
            let messages = `Wallet: ${wallet.name} \n` + 'Balance change: \n'
            for (let i = 0; i < listCoin.length; i += 1) {
              const coin = listCoin[i]
              let total = 0
              let totalOld = 0
              let checkSend = false
              let oldBalanceSpot = 0
              if (balances) {
                try {
                  let check = false
                  for (let j = 0; j < listCoinHistory.length; j++) {
                    if (coin == listCoinHistory[j].code) {
                      oldBalanceSpot = listCoinHistory[j].amount
                      if (parseFloat(balances[coin].available) != listCoinHistory[j].amount) {
                        console.log(listCoinHistory[j].amount)
                        check = true
                        break
                      }
                    }
                  }
                  messages += 'Coin: ' + coin +'\n'
                  messages += '-Type: Spot' +'\n'
                  messages += '-OldAmount: ' + oldBalanceSpot +'\n'
                  messages += '-NewAmount: ' + parseFloat(balances[coin].available) +'\n'
                  totalOld += oldBalanceSpot
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
                } catch (e) {
                  console.log(e)
                }
              } else {
                for (let j = 0; j < listCoinHistory.length; j++) {
                  if (coin == listCoinHistory[j].code) {
                    oldBalanceSpot = listCoinHistory[j].amount
                    break
                  }
                }
                messages += 'Coin: ' + coin +'\n'
                messages += '-Type: Spot' +'\n'
                messages += '-OldAmount: ' + oldBalanceSpot +'\n'
                messages += '-NewAmount: ' + oldBalanceSpot +'\n'
              }
  
              let oldBalanceFunding = 0
              if (balancesFunding) {
                try {
                  const asset = balancesFunding.find(x => x.asset === coin)
                  let newAmount = 0
                  if (asset) {
                    newAmount = asset.free
                  }
                  let check = false
                  for (let j = 0; j < listCoinHistoryFunding.length; j++) {
                    if (coin == listCoinHistoryFunding[j].code) {
                      if (parseFloat(newAmount) !=  parseFloat(listCoinHistoryFunding[j].amount)) {
                        check = true
                        oldBalanceFunding = listCoinHistoryFunding[j].amount
                        break
                      }
                    }
                  }
                  messages += '-Type: Funding' +'\n'
                  messages += '+OldAmount: ' + oldBalanceFunding +'\n'
                  messages += '+NewAmount: ' + newAmount +'\n'
                  totalOld += oldBalanceFunding
                  total += parseFloat(newAmount)
                  if (check) {
                    checkSend = true
                    let update = {
                      amount: parseFloat(newAmount)
                    }
                    Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'funding'}, update,{ new: true}, function(err) {
                      if (err) console.log(err)
                    })
                  }
                } catch (e) {
                  console.log(e)
                }
              } else {
                for (let j = 0; j < listCoinHistoryFunding.length; j++) {
                  if (coin == listCoinHistoryFunding[j].code) {
                    oldBalanceFunding = listCoinHistoryFunding[j].amount
                    break
                  }
                }
                messages += '-Type: Funding' +'\n'
                messages += '+OldAmount: ' + oldBalanceFunding +'\n'
                messages += '+NewAmount: ' + oldBalanceFunding+'\n'
              }

              let oldBalanceEarn = 0
              if (balancesEarn) {
                try {
                  let check = false
                  for (let j = 0; j < listCoinHistoryEarn.length; j++) {
                    if (coin == listCoinHistoryEarn[j].code) {
                      oldBalanceEarn = listCoinHistoryEarn[j].amount
                      console.log('11111111111')
                      console.log(parseFloat(balancesEarn.totalAmountInUSDT))
                      console.log(parseFloat(oldBalanceEarn))
                      console.log(parseFloat(balancesEarn.totalAmountInUSDT) - parseFloat(oldBalanceEarn) >= 2 || (parseFloat(balancesEarn.totalAmountInUSDT) - parseFloat(oldBalanceEarn)) * -1 >= 2)
                      if (parseFloat(balancesEarn.totalAmountInUSDT) - parseFloat(oldBalanceEarn) >= 2 || (parseFloat(balancesEarn.totalAmountInUSDT) - parseFloat(oldBalanceEarn)) * -1 >= 2) {
                        check = true
                        break
                      }
                    }
                  }
                  messages += '+Type: Earn' +'\n'
                  messages += '+OldAmount: ' + Math.floor(parseFloat(oldBalanceEarn)) +'\n'
                  messages += '+NewAmount: ' + Math.floor(parseFloat(balancesEarn.totalAmountInUSDT)) +'\n'
                  totalOld += oldBalanceEarn
                  total += parseFloat(balancesEarn.totalAmountInUSDT)
                  if (check) {
                    checkSend = true
                    let update = {
                      amount: parseFloat(balancesEarn.totalAmountInUSDT)
                    }
                    Coin.findOneAndUpdate({code: coin, idWallet: wallet.id, typeWallet: 'earn'}, update,{ new: true}, function(err) {
                      if (err) console.log(err)
                    })
                  }
                } catch (e) {
                  console.log(e)
                }
              } else {
                for (let j = 0; j < listCoinHistoryEarn.length; j++) {
                  if (coin == listCoinHistoryEarn[j].code) {
                    oldBalanceEarn = listCoinHistoryEarn[j].amount
                    break
                  }
                }
                messages += 'Coin: ' + coin +'\n'
                messages += '-Type: Earn' +'\n'
                messages += '-OldAmount: ' + Math.floor(parseFloat(oldBalanceEarn)) +'\n'
                messages += '-NewAmount: ' + Math.floor(parseFloat(oldBalanceEarn)) +'\n'
              }
  
              messages += 'Total: ' + Math.floor(total) + '\n'
              console.log(messages)
              totalBalance[coin] = {old: totalOld, new: total}
              if (checkSend) {
                console.log('vao day')
                botLoggerService.sendMessage(messages, wallet.statusChange)
                totalBalance.checkSend = true
              }
              return resolve(totalBalance)
            }
          } catch (e) {
            console.log(e)
            return resolve({USDT: {old: -1, new: -1}, checkSend: false})
          }
        })
      },
      getBalanceWallet: async function() {
        try {
          const time = await binance.useServerTime();
          const balances = await binanceService.getBalanceFunding(time.serverTime, wallet)
          console.log(balances)
        } catch (e) {

        }
      }
    }
  },
 test: async function () {
    console.log('test')
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
