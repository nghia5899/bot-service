const cronJob = require('cron')
const cloneHistoryService = require('./clone-history-service')
const coinService = require('./coin-service')

let jobAddHistoryMinute = new cronJob.CronJob({
  cronTime: '*/10 * * * *', 
  onTick: async function() {
    console.log(`History minute - ${getTime()}`)
    try {
      await cloneHistoryService.jobAddHistoryMinute()
      cloneHistoryService.deleteLastHistoryMinute()
    } catch (e) {
      console.log(e)
    }
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobAddHistoryHour = new cronJob.CronJob({
  cronTime: '*/30 * * * *', 
  onTick: async function() {
    console.log(`History hour - ${getTime()}`)
    try {
      await cloneHistoryService.jobAddHistoryHour()
      cloneHistoryService.deleteLastHistoryHour()
    } catch (e) {
      console.log(e)
    }
  
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

let jobGetSymbolsPrice = new cronJob.CronJob({
  cronTime: '*/5 * * * *', 
  onTick: function() {
    console.log(`Price - ${getTime()}`)
    try {
      coinService.initCoin()
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
  startJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Start Job Get Symbols Price |')
    console.log('-------------------------------')
    jobGetSymbolsPrice.start()
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
  stopJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Stop Job Get Symbols Price |')
    console.log('-------------------------------')
    jobGetSymbolsPrice.stop()
  }
}

module.exports = jobController