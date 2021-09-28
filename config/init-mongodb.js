const mongoose = require('mongoose')
const server = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017'
const database =  process.env.MONGODB_DATABASE || 'crypto'
const jobService = require('../services/job-service')
const cloneHistoryService = require('../services/clone-history-service')

console.log(server)
mongoose
  .connect(server + '/' + database, {
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => {
    console.log(err.message)
  })

mongoose.connection.on('connected', () => {
  console.log('mongodb connected.......')
  cloneHistoryService.refreshAllHistory()
  jobService.startjobAddHistoryMinute()
  jobService.startjobAddHistoryHour()
  jobService.startJobGetSymbolsPrice()
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('mongodb connection is disconnected.')
  jobService.stopJobAddHistoryMinute()
  jobService.stopJobAddHistoryHour()
  jobService.stopJobGetSymbolsPrice()
})

module.exports = mongoose.connection