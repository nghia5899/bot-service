const cronJob = require('cron')
const coinService = require('./coin-service')
const { Wallet } = require('../models/wallet')

let jobGetBalance = new cronJob.CronJob({
  cronTime: ' */10 * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    try {
      const listWallet = await Wallet.find()
      for (let j = 0; j < listWallet.length; j++) {
        const binnaceObj = coinService.BinaceOption(listWallet[j])
        binnaceObj.getBalance()
      }
    } catch (e) {
      console.log(e)
    }
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetHistory = new cronJob.CronJob({
  cronTime: '*/20 * * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime()}`)
    try {
      logicJob()
    } catch (e) {
      console.log(e)
    }
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

async function logicJob() {
  const listWallet = await Wallet.find()
  for (let j = 0; j < listWallet.length; j++) {
    console.log(listWallet[j].id)
    const binnaceObj = coinService.BinaceOption(listWallet[j])
    binnaceObj.getHistoryDeposit()
    binnaceObj.getHistoryWithdraw()
    binnaceObj.checkBalance()
  }
}

function getTime() {
  let today = new Date();
  return `${today.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })} ${Date.now()}`
}

let jobController = {
  startJobGetBalances() {
    console.log('----------------------------')
    console.log('| Start Job Check Balances |')
    console.log('----------------------------')
    try {
      jobGetBalance.start()
      jobGetHistory.start()
    } catch (e) {
      console.log(e)
    }
  },
  stopJobGetBalances() {
    console.log('----------------------------')
    console.log('| Stop Job Check Balances  |')
    console.log('----------------------------')
    try {
      jobGetBalance.stop()
      jobGetHistory.stop()
    } catch (e) {
      console.log(e)
    }
  },
}

module.exports = jobController
