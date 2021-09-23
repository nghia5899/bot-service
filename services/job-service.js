const cronJob = require('cron')
const cloneHistoryService = require('./clone-history-service')
const coinService = require('./coin-service')

let jobAddHistoryMinute = new cronJob.CronJob({
  cronTime: '*/1 * * * *', 
  onTick: function() {
    cloneHistoryService.jobAddHistoryMinute().then(() => {
      cloneHistoryService.deleteLastHistoryMinute()
    })
    getTime()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobAddHistoryHour = new cronJob.CronJob({
  cronTime: '*/30 * * * *', 
  onTick: function() {
    cloneHistoryService.jobAddHistoryHour().then(() => {
      cloneHistoryService.deleteLastHistoryHour()
    })
    getTime()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetSymbolsPrice = new cronJob.CronJob({
  cronTime: '*/1 * * * *', 
  onTick: function() {
    coinService.initCoin()
    getTime()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

function getTime() {
  let today = new Date();
  console.log(`${today} ${Date.now()}`)
}

let jobController = {
  startjobAddHistoryMinute() {
    console.log('------------------------')
    console.log('| Start Job Add Minute |')
    console.log('------------------------')
    jobAddHistoryMinute.start()
  },
  startjobAddHistoryHour() {
    console.log('----------------------')
    console.log('| Start Job Add Hour |')
    console.log('----------------------')
    jobAddHistoryHour.start()
  },
  stopJobAddHistoryMinute() {
    console.log('-----------------------')
    console.log('| Stop Job Add Minute |')
    console.log('-----------------------')
    jobAddHistoryMinute.stop()
  },
  stopJobAddHistoryHour() {
    console.log('---------------------')
    console.log('| Stop Job Add Hour |')
    console.log('---------------------')
    jobAddHistoryHour.stop()
  },
  startJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Start Job Get Symbols Price |')
    console.log('-------------------------------')
    jobGetSymbolsPrice.start()
  },
  stopJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Start Job Get Symbols Price |')
    console.log('-------------------------------')
    jobGetSymbolsPrice.start()
  }
}

module.exports = jobController