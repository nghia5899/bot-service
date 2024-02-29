const jobService = require('../services/job-service')
const {ResponseData} = require('../helpers/response-data')

class JobController {
  startJob = (req, res) => {
    try {
      jobService.startJobGetBalances()
      return res.json(new ResponseData(true, "Start job check success").toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }
  
  stopJob = (req, res) => {
    try {
      jobService.stopJobGetBalances()
      return res.json(new ResponseData(true, "Stop job check success").toJson())
    } catch (e) {
      console.log(e)
      return res.json(new ResponseData(false, e).toJson())
    }
  }
}

module.exports = new JobController