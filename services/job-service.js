const cronJob = require('cron')
const cloneHistoryService = require('./clone-history-service')
const coinService = require('./coin-service')

let jobAddHistoryMinute = new cronJob.CronJob({
  cronTime: '*/12 * * * *', 
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
      coinService.getMarketData()
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
    try {
      jobAddHistoryMinute.start()
    } catch (error) {
      console.log(error)
    }
  },
  startjobAddHistoryHour() {
    console.log('----------------------')
    console.log('| Start Job Add Hour |')
    console.log('----------------------')
    try {
      jobAddHistoryHour.start()
    } catch (error) {
      console.log(error)
    }
    
  },
  startJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Start Job Get Symbols Price |')
    console.log('-------------------------------')
    try {
      jobGetSymbolsPrice.start()
    } catch (error) {
      console.log(error)
    }
    
  },
  stopJobAddHistoryMinute() {
    console.log('-----------------------')
    console.log('| Stop Job Add Minute |')
    console.log('-----------------------')
    try {
      jobAddHistoryMinute.stop()
    } catch (error) {
      console.log(error)
    }
    
  },
  stopJobAddHistoryHour() {
    console.log('---------------------')
    console.log('| Stop Job Add Hour |')
    console.log('---------------------')
    try {
      jobAddHistoryHour.stop()
    } catch (error) {
      console.log(error)
    }
    
  },
  stopJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Stop Job Get Symbols Price |')
    console.log('-------------------------------')
    try {
      jobGetSymbolsPrice.stop()
    } catch (error) {
      console.log(error)
    }
    
  }
}

module.exports = jobController