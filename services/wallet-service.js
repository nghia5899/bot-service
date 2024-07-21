const { TrxWallet } = require('../models/trx_wallet')
const botTrxWallet = require('../bot/bot-logger-service-wallet');
const botTrxWalletClient = require('../bot/bot-logger-service-wallet-client');
const axios = require('axios')

const walletService = {
  async addWalletFromBot(wallet) {
    return new Promise(async function(resolve, reject) {
      try {
        const response = await TrxWallet({
          name: wallet.name,
          address: wallet.address,
          balance: 0,
          status: true,
          statusChange: true,
        }).save()
        if (!response) return resolve({status: false, message: 'Lỗi'})
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
        TrxWallet.findOneAndDelete({_id: wallet.id} , function (err, docs) { 
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
  async updateWalletFromBot(wallet) {
    return new Promise(async function(resolve, reject) {
      try {
        TrxWallet.findOneAndUpdate({_id: wallet.id}, wallet, function (err, docs) { 
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
        const listWallet = await TrxWallet.find({})
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
  async getBalanceUSDT_TRC20(ctx) {
    console.log('------getBalanceUSDT_TRC20-------')
    const listTrxWallet = await TrxWallet.find()
    let total = 0
    for (let i = 0; i < listTrxWallet.length; i++) {
      console.log('==================  ', i)
      let messages = `Wallet: ${listTrxWallet[i].name} \n`
          messages += `Address: ${listTrxWallet[i].address} \n`
          messages += 'Balance: ' + Math.floor(parseFloat(listTrxWallet[i].balance)) +'\n'
      // if (ctx) {
      //   const chatId = ctx.message.chat.id
      //   await ctx.telegram.sendMessage(chatId, messages)
      // } else {
      //   await botTrxWallet.sendMessage(messages)
      // }

      total += Math.floor(parseFloat(listTrxWallet[i].balance))
    }
    if (ctx) {
      ctx.telegram.sendMessage(ctx.message.chat.id,`Tru Wallet: ${total}`)
    } else {
      botTrxWallet.sendMessage(`Tru Wallet: ${total}`)
    }
  },
  async getBalanceUSDT_TRC20_client(ctx) {
    console.log('------getBalanceUSDT_TRC20-------')
    const listTrxWallet = await TrxWallet.find()
    let total = 0
    for (let i = 0; i < listTrxWallet.length; i++) {
      total += Math.floor(parseFloat(listTrxWallet[i].balance))
    }
    botTrxWalletClient.sendMessage(`Tru Wallet: ${total}`)
  },
  async checkBalanceUSDT_TRC20() {
    console.log('------checkBalanceUSDT_TRC20-------')
/*     const response = await TrxWallet({
      address: 'TGjJVhczXtQou3CDodGRV4bo9dKZw3Yf6C',
      balance: 0,
    }).save()
 */
    const listTrxWallet = await TrxWallet.find()
    console.log(listTrxWallet)
    let check = false
    let totalNew = 0
    let totalOld = 0
    for (let i = 0; i < listTrxWallet.length; i++) {
      const balance = await getBalanceUSDT(listTrxWallet[i].address)
      console.log('balance new')
      console.log(balance)
      totalOld += parseFloat(listTrxWallet[i].balance)
      console.log('balance old')
      console.log(parseFloat(listTrxWallet[i].balance))
      if (balance < 0) return
      if (parseFloat(balance) - parseFloat(listTrxWallet[i].balance) > 5 || parseFloat(balance) - parseFloat(listTrxWallet[i].balance) < -5) {
        check = true
        let messages = `Wallet: ${listTrxWallet[i].name} \n`
        messages += `Address: ${listTrxWallet[i].address} \n`
        messages += `Balance change: \n`
        messages += 'Coin: USDT_TRC20' +'\n'
        messages += '-OldAmount: ' + Math.floor(parseFloat(listTrxWallet[i].balance)) +'\n'
        messages += '-NewAmount: ' + Math.floor(parseFloat(balance)) +'\n'

        totalNew += parseFloat(balance)
        let update = {
          balance: balance
        }
        TrxWallet.findOneAndUpdate({address: listTrxWallet[i].address}, update,{ new: true}, function(err) {
          if (err) console.log(err)
        })
        console.log(messages)
        await botTrxWallet.sendMessage(messages)
      } else {
        totalNew += parseFloat(listTrxWallet[i].balance)
      }
    } 
    
    if (check) {
      botTrxWallet.sendMessage(`Tru Wallet Old: ${Math.floor(totalOld)} \nTru Wallet New: ${Math.floor(totalNew)}`, true)
      //botTrxWalletClient.sendMessage(`Tru Wallet: ${Math.floor(totalNew)}`, true)
    }
  },
}

async function getBalanceUSDT(address) {
  return new Promise( async (resolve, reject) => {
    try {
      const res = await getBalanceTrx(address)
      const data = res.data.data
      for (let i = 0; i < data.length; i++) {
        if (data[i].tokenId == 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t') {
          return resolve(data[i].quantity)
        }
      }
      return resolve(0)
    } catch (e) {
      console.log(e)
      return resolve(-1)
    }
  })
}

function getBalanceTrx(address) {
  return new Promise((resolve, reject) => {
    const instance = axios.create()
    instance.get('https://apilist.tronscan.org/api/account/tokens?address=' + address)
      .then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
  })
}

module.exports = walletService