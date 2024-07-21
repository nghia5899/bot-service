const cronJob = require('cron')
const coinService = require('./coin-service')
const walletService = require('./wallet-service')
const { Wallet } = require('../models/wallet')
const { Bot } = require('../models/bot')
const botLoggerService = require('../bot/bot-logger-service');
const botLoggerServiceGuest = require('../bot/bot-logger-service-guest');
const botWalleTrx = require('../bot/bot-logger-service-wallet');
const botWalleTrxClient = require('../bot/bot-logger-service-wallet-client');

let jobGetBalance = new cronJob.CronJob({
  cronTime: ' 0 */1 * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    handleGetBalance()
    handleGetBalanceTrx()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetBalanceClient = new cronJob.CronJob({
  cronTime: ' 1 */4 * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    handleGetBalanceClient()
    handleGetBalanceTrxClient()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetHistory = new cronJob.CronJob({
  cronTime: '*/30 * * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime()}`)
    try {
      logicJob()
      walletService.checkBalanceUSDT_TRC20()
    } catch (e) {
      console.log(e)
    }
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetBalanceTrxWallet = new cronJob.CronJob({
  cronTime: '*/1 * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    walletService.checkBalanceUSDT_TRC20()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetIdChat = new cronJob.CronJob({
  cronTime: '  */1 * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    console.log(`----  JobGetIdChat ---`)
    botLoggerService.listenChatId('7151582118:AAEbmlcYREs3bnKF6Q0lhYX9JnlhqpA1kxQ')
    botLoggerServiceGuest.listenChatId('6649320854:AAFv3PT6c3BCNMJHb4bK2nI-bh1y3yBTW4Y')
    botWalleTrx.listenChatId('7147546376:AAHUtbOs7slrb4BT3MewEC-f4JZ_kClvMCk')
    botWalleTrxClient.listenChatId('7493536537:AAG7fSjyzYxhmhg78vCButZc2S85cGlSCtw')
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
      botLoggerService.sendMessage(`Bina Wallet Old: ${Math.floor(totalAllWalletOld)} \n Bina Wallet New: ${Math.floor(totalAllWalletNew)}`, true)
      //botLoggerServiceGuest.sendMessage(`Total All Wallet Old: ${Math.floor(totalAllWalletOld)} \nTotal All Wallet New: ${Math.floor(totalAllWalletNew)}`, true)
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
          handleGetBalanceTrx()
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
          handleGetBalanceTrx()
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
      jobGetBalanceClient.start()
      jobGetHistory.start()
      jobGetIdChat.start()
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
    botLoggerService.sendMessage(`Bina Wallet: ${totalAllWallet}`, true)
  } catch (e) {
    console.log(e)
  }
}

async function handleGetBalanceClient() {
  try {
    let totalAllWallet = 0
    const listWallet = await Wallet.find()
    for (let j = 0; j < listWallet.length; j++) {
      const binnaceObj = coinService.BinaceOption(listWallet[j])
      const totalBalance = await binnaceObj.getBalanceClient()
      if (listWallet[j].status) {
        totalAllWallet += totalBalance['USDT']
      }
    }
    botLoggerServiceGuest.sendMessage(`Bina Wallet: ${totalAllWallet}`, true)
  } catch (e) {
    console.log(e)
  }
}

async function handleGetBalanceTrx() {
  try {
    walletService.getBalanceUSDT_TRC20()
  } catch (e) {
    console.log(e)
  }
}

async function handleGetBalanceTrxClient() {
  try {
    walletService.getBalanceUSDT_TRC20_client()
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
