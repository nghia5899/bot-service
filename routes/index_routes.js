const historyRoutes = require('./history_route')
const currencyRoutes = require('./currency_route')
const coinRoutes = require('./coin_route')
const jobRoutes = require('./job_routes')
function route(app) {

  app.use('/history', historyRoutes)

  app.use('/currency', currencyRoutes)

  app.use('/coin', coinRoutes)

  app.use('/job', jobRoutes)

  app.use('/', (req, res) => {
    console.log("default")
  })
}

module.exports = route