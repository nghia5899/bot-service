const jobService = require('../services/job-service')
const {ResponseData} = require('../helpers/response-data')

class JobController {
  startJob = (req, res) => {
    try {
      jobService.startjobAddHistoryMinute()
      jobService.startjobAddHistoryHour()
      return res.json(new ResponseData(true, "Start job addAllCurrencyHistory success").toJson())
    } catch (e) {
      console.log(e)
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
      return res.json(new ResponseData(false, e).toJson())
    }
  }
}

module.exports = new JobController