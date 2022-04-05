const cronJob = require('cron')
const cloneHistoryService = require('./clone-history-service')
const coinService = require('./coin-service')
const logger = require('../helpers/logger')('JobService')
const botLoggerService = require('../services/bot-logger-service')

let jobAddHistoryMinute = new cronJob.CronJob({
  cronTime: '*/12 * * * *', 
  onTick: async function() {
    console.log(`History minute - ${getTime()}`)
    try {
      await cloneHistoryService.jobAddHistoryMinute()
      cloneHistoryService.deleteLastHistoryMinute()
    } catch (e) {
      console.log(e)
      botLoggerService.sendErrorMessage(e)
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
      botLoggerService.sendErrorMessage(e)
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
      botLoggerService.sendErrorMessage(error)
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
    } catch (e) {
      console.log(e)
      botLoggerService.sendErrorMessage(e)
    }
  },
  startjobAddHistoryHour() {
    console.log('----------------------')
    console.log('| Start Job Add Hour |')
    console.log('----------------------')
    try {
      jobAddHistoryHour.start()
    } catch (e) {
      console.log(e)
      botLoggerService.sendErrorMessage(e)
    }
    
  },
  startJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Start Job Get Symbols Price |')
    console.log('-------------------------------')
    try {
      jobGetSymbolsPrice.start()
    } catch (e) {
      console.log(e)
      botLoggerService.sendErrorMessage(e)
    }
    
  },
  stopJobAddHistoryMinute() {
    console.log('-----------------------')
    console.log('| Stop Job Add Minute |')
    console.log('-----------------------')
    try {
      jobAddHistoryMinute.stop()
    } catch (e) {
      console.log(e)
      botLoggerService.sendErrorMessage(e)
    }
    
  },
  stopJobAddHistoryHour() {
    console.log('---------------------')
    console.log('| Stop Job Add Hour |')
    console.log('---------------------')
    try {
      jobAddHistoryHour.stop()
    } catch (e) {
      console.log(e)
      botLoggerService.sendErrorMessage(e)
    }
    
  },
  stopJobGetSymbolsPrice() {
    console.log('-------------------------------')
    console.log('| Stop Job Get Symbols Price |')
    console.log('-------------------------------')
    try {
      jobGetSymbolsPrice.stop()
    } catch (e) {
      console.log(e)
      botLoggerService.sendErrorMessage(e)
    }
    
  }
}

module.exports = jobController