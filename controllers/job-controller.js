const jobService = require('../services/job-service')
const {ResponseData} = require('../helpers/response-data')
const botLoggerService = require('../services/bot-logger-service')
const logger = require('../helpers/logger')('JobController')

class JobController {
  startJob = (req, res) => {
    try {
      jobService.startjobAddHistoryMinute()
      jobService.startjobAddHistoryHour()
      return res.json(new ResponseData(true, "Start job addAllCurrencyHistory success").toJson())
    } catch (e) {
      console.log(e)
      botLoggerService.sendMessage(logger(e.message))
      return res.json(new ResponseData(false, e).toJson())
    }
  }
  
  stopJob = (req, res) => {
    try {
      jobService.jobAddHistoryMinute.stop()
      jobService.jobAddHistoryHour.stop()
      return res.json(new ResponseData(true, "Stop job addAllCurrencyHistory success").toJson())
    } catch (e) {
      console.log(e)
      botLoggerService.sendMessage(logger(e.message))
      return res.json(new ResponseData(false, e).toJson())
    }
  }
}

module.exports = new JobController