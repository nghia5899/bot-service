const cronJob = require('cron')
const cloneHistoryService = require('../services/clone-history-service')
const {ResponseData} = require('../helpers/response-data')

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
    return res.json(new ResponseData(true, "Start job addAllCurrencyHistory success").toJson())
  } catch (e) {
    console.log(e)
    return res.json(new ResponseData(false, e).toJson())
  }
}

jobController.stopJob = (req, res) => {
  console.log('-------------')
  console.log('| Stop Job |')
  console.log('-------------')
  try {
    jobAddHistoryMinute.stop()
    jobAddHistoryHour.stop()
    return res.json(new ResponseData(true, "Stop job addAllCurrencyHistory success").toJson())
  } catch (e) {
    console.log(e)
    return res.json(new ResponseData(false, e).toJson())
  }
}

module.exports = jobController