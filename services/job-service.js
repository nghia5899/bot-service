const cronJob = require('cron')
const cloneHistoryService = require('./clone-history-service')
const coinService = require('./coin-service')

let jobAddHistoryMinute = new cronJob.CronJob({
  cronTime: '*/1 * * * *', 
  onTick: function() {
    cloneHistoryService.jobAddHistoryMinute().then(() => {
      cloneHistoryService.deleteLastHistoryMinute()
    })
    console.log(`History minute - ${getTime()}`)
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobAddHistoryHour = new cronJob.CronJob({
  cronTime: '*/20 * * * *', 
  onTick: function() {
    cloneHistoryService.jobAddHistoryHour().then(() => {
      cloneHistoryService.deleteLastHistoryHour()
    })
    console.log(`History hour - ${getTime()}`)
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetSymbolsPrice = new cronJob.CronJob({
  cronTime: '*/1 * * * *', 
  onTick: function() {
    coinService.initCoin()
    console.log(`Price - ${getTime()}`)
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

function getTime() {
  let today = new Date();
  return `${today} ${Date.now()}`
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