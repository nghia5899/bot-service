const cronJob = require('cron')
const coinService = require('./coin-service')
const botLoggerService = require('../services/bot-logger-service')

let jobAddHistoryMinute = new cronJob.CronJob({
  cronTime: '*/12 * * * *', 
  onTick: async function() {
    console.log(`History minute - ${getTime()}`)
    try {
      botLoggerService.sendMessage("Toi la bot day")
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
    } catch (e) {
      console.log(e)
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
    }
  },
}

module.exports = jobController