const historyRoutes = require('./history-route')
const currencyRoutes = require('./currency-route')
const coinRoutes = require('./coin-route')
const jobRoutes = require('./job-routes')
const apiResponse = require('../helpers/apiResponse')

function route(app) {

  app.use('/history', historyRoutes)

  app.use('/currency', currencyRoutes)

  app.use('/coin', coinRoutes)

  app.use('/job', jobRoutes)

  app.use('/', (req, res) => {
    return apiResponse.notFoundResponse(res, "Not found")
  })
}

module.exports = route