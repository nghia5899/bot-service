const cronJob = require('cron')
const coinService = require('./coin-service')
const { Wallet } = require('../models/wallet')
const { Bot } = require('../models/bot')
const botLoggerService = require('../bot/bot-logger-service');
const botLoggerServiceGuest = require('../bot/bot-logger-service-guest');

let jobGetBalance = new cronJob.CronJob({
  cronTime: ' 30 */1 * * *', 
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

let jobGetIdChat = new cronJob.CronJob({
  cronTime: '  */1 * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    botLoggerService.listenChatId('7151582118:AAEbmlcYREs3bnKF6Q0lhYX9JnlhqpA1kxQ')
    botLoggerServiceGuest.listenChatId('6649320854:AAFv3PT6c3BCNMJHb4bK2nI-bh1y3yBTW4Y')
    /* await Bot({token: '', idBot: '', status: true}).save()
    const listBot = await Bot.find({})
    for (let i = 0; i < listBot.length; i++) {
      botLoggerService.listenChatId(listBot[i].token)
      botLoggerServiceGuest.listenChatId(listBot[i].token)
    } */
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
      botLoggerService.sendMessage(`Total All Wallet Old: ${totalAllWalletOld} \nTotal All Wallet New: ${totalAllWalletNew}`, true)
      botLoggerServiceGuest.sendMessage(`Total All Wallet Old: ${totalAllWalletOld} \nTotal All Wallet New: ${totalAllWalletNew}`, true)
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
      /* jobGetBalance.start()
      jobGetHistory.start()
      jobGetIdChat.start() */
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
    await sleep(1000)
    botLoggerService.sendMessage(`Total All Wallet: ${totalAllWallet}`, true)
    await sleep(1000)
    botLoggerServiceGuest.sendMessage(`Total All Wallet: ${totalAllWallet}`, true)
  } catch (e) {
    console.log(e)
  }
}

var sleepSetTimeout_ctrl;
function sleep(ms) {
  clearInterval(sleepSetTimeout_ctrl);
  return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

module.exports = jobController
