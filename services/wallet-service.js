const { TrxWallet } = require('../models/trx_wallet')
const botLoggerService = require('../bot/bot-logger-service');

const walletService = {
  async checkBalanceUSDT_TRC20() {
    const response = await TrxWallet({
      address: 'TGjJVhczXtQou3CDodGRV4bo9dKZw3Yf6C',
      balance: 0,
    }).save()
/* 
    const listTrxWallet = await TrxWallet.find()
    let check = false
    let totalNew = 0
    let totalOld = 0
    for (let i = 0; i < data.length; i++) {
      const balance = await getBalanceUSDT_TRC20(listTrxWallet[i].address)
      totalOld += parseFloat(listTrxWallet[i].balance)
      if (parseFloat(balance) != parseFloat(listTrxWallet[i].balance)) {
        check = true
        let messages = `Wallet: ${wallet.name} \n`
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
        botLoggerService.sendMessage(messages)
      } else {
        totalNew += parseFloat(listTrxWallet[i].balance)
      }
    }  */
    /* if (check) {
      botLoggerService.sendMessage(`Total All Wallet Old: ${Math.floor(totalOld)} \nTotal All Wallet New: ${Math.floor(totalNew)}`, true)
    } */
  },
}

async function getBalanceUSDT_TRC20() {
  return new Promise( async (resolve, reject) => {
    try {
      const res = await getBalanceTrx('TGjJVhczXtQou3CDodGRV4bo9dKZw3Yf6C')
      const data = res.data
      for (let i = 0; i < data.length; i++) {
        if (data[i].tokenId == 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t') {
          return resolve(data[i].quantity)
        }
      }
      return resolve(0)
    } catch (e) {
      return resolve(0)
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