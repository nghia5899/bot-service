const historyRoutes = require('./history-route')
const currencyRoutes = require('./currency-route')
const coinRoutes = require('./coin-route')
const jobRoutes = require('./job-routes')
const authRoutes = require('./auth-route')
const {ResponseData} = require('../helpers/response-data')

function route(app) {

  app.use('/auth', authRoutes)

  app.use('/history', historyRoutes)

  app.use('/currency', currencyRoutes)

  app.use('/coin', coinRoutes)

  app.use('/job', jobRoutes)

  app.use('/', (req, res) => {
    return res.status(404).json(new ResponseData(false, "Not found").toJson())
  })
}

module.exports = route