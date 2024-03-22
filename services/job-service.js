const cronJob = require('cron')
const coinService = require('./coin-service')
const { Wallet } = require('../models/wallet')
const botLoggerService = require('../bot/bot-logger-service');
const botLoggerServiceGuest = require('../bot/bot-logger-service-guest');

let jobGetBalance = new cronJob.CronJob({
  cronTime: '*/20 * * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    handleGetBalance()
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
  try {
    let totalAllWalletOld = 0
    let totalAllWalletNew = 0
    let checkSend = false
    const listWallet = await Wallet.find()
    for (let j = 0; j < listWallet.length; j++) {
      console.log(listWallet[j].id)
      const binnaceObj = coinService.BinaceOption(listWallet[j])
      const totalBalance = await binnaceObj.checkBalance()
      if (totalBalance.checkSend) {
        checkSend = true
      }
      if (listWallet[j].status) {
        totalAllWalletOld += totalBalance['USDT'].old
        totalAllWalletNew += totalBalance['USDT'].new
      }
    }
    if (checkSend) {
      await botLoggerService.sendMessage(`Total All Wallet Old: ${totalAllWalletOld}`, true)
      botLoggerService.sendMessage(`Total All Wallet New: ${totalAllWalletNew}`, true)
    }
  } catch(e) {
    console.log(e)
  }
}

function getTime() {
  let today = new Date();
  return `${today.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })} ${Date.now()}`
}

let jobController = {
  updateTimeBalance(time) {
    try {
      console.log('updateTimeBalance')
      if (typeof(Number(time)) != 'number') return {status: false}
      jobGetBalance.stop()
      jobGetBalance = new cronJob.CronJob({
        cronTime: `0 */${parseInt(time)} * * *`, 
        onTick: async function() {
          console.log(`Time - ${getTime().toLocaleLowerCase()}`)
          handleGetBalance()
        },
        timeZone: 'Asia/Ho_Chi_Minh'
      })

      jobGetBalance.start()
      return {status: true}
    } catch(e) {
      console.log(e)
      return {status: false}
    }
  },
  updateTimeBalanceMinute(time) {
    try {
      console.log('updateTimeBalanceMinute')
      if (typeof(Number(time)) != 'number') return {status: false}
      jobGetBalance.stop()
      jobGetBalance = new cronJob.CronJob({
        cronTime: `*/${parseInt(time)} * * * *`, 
        onTick: async function() {
          console.log(`Time - ${getTime().toLocaleLowerCase()}`)
          handleGetBalance()
        },
        timeZone: 'Asia/Ho_Chi_Minh'
      })

      jobGetBalance.start()
      return {status: true}
    } catch(e) {
      console.log(e)
      return {status: false}
    }
  },
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

async function handleGetBalance() {
  try {
    let totalAllWallet = 0
    const listWallet = await Wallet.find()
    for (let j = 0; j < listWallet.length; j++) {
      const binnaceObj = coinService.BinaceOption(listWallet[j])
      const totalBalance = await binnaceObj.getBalance()
      if (listWallet[j].status) {
        totalAllWallet += totalBalance['USDT']
      }
    }
    botLoggerService.sendMessage(`Total All Wallet: ${totalAllWallet}`, true)
  } catch (e) {
    console.log(e)
  }
}

module.exports = jobController
