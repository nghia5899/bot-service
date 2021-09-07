const cronJob = require('cron')
const cloneHistoryService = require('../services/clone-history-service')
const apiResponse = require('../helpers/apiResponse')

var jobController = {}

function getTime() {
  let today = new Date();
  console.log(`${today} ${Date.now()}`)
}

var jobAddHistoryMinute = new cronJob.CronJob({
  cronTime: '*/1 * * * *', 
  onTick: function() {
    cloneHistoryService.jobAddHistoryMinute().then(() => {
      cloneHistoryService.deleteLastHistoryMinute()
    })
    getTime()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

var jobAddHistoryHour = new cronJob.CronJob({
  cronTime: '*/30 * * * *', 
  onTick: function() {
    cloneHistoryService.jobAddHistoryHour().then(() => {
      cloneHistoryService.deleteLastHistoryHour()
    })
    getTime()
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

jobController.startJob = (req, res) => {
  console.log('-------------')
  console.log('| Start Job |')
  console.log('-------------')
  try {
    jobAddHistoryMinute.start()
    jobAddHistoryHour.start()
    apiResponse.successResponse(res, "Start job addAllCurrencyHistory success")
  } catch (e) {
    console.log(e)
    apiResponse.errorResponse(res, "Start job addAllCurrencyHistory fail'")
  }
}

jobController.stopJob = (req, res) => {
  console.log('-------------')
  console.log('| Stop Job |')
  console.log('-------------')
  try {
    jobAddHistoryMinute.stop()
    jobAddHistoryHour.stop()
    apiResponse.successResponse(res, "Stop job addAllCurrencyHistoryMinute success")
  } catch (e) {
    console.log(e)
    apiResponse.errorResponse(res, "Stop job addAllCurrencyHistory fail'")
  }
}

module.exports = jobController