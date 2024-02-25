const cronJob = require('cron')
const coinService = require('./coin-service')

let jobGetBalance = new cronJob.CronJob({
  cronTime: '*/30 * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime()}`)
    try {
      coinService.getBalance()
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
      coinService.getHistoryDeposit()
      coinService.getHistoryWithdraw()
    } catch (e) {
      console.log(e)
    }
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

function getTime() {
  let today = new Date();
  return `${today} ${Date.now()}`
}

let jobController = {
  startJobGetBalances() {
    console.log('--------------------------')
    console.log('| Start Job Get Balances |')
    console.log('--------------------------')
    try {
      jobGetBalance.start()
      jobGetHistory.start()
    } catch (e) {
      console.log(e)
    }
  },
  stopJobGetBalances() {
    console.log('--------------------------')
    console.log('| Stop Job Get Balances  |')
    console.log('--------------------------')
    try {
      jobGetBalance.stop()
    } catch (e) {
      console.log(e)
    }
  },
}

module.exports = jobController