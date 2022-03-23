const historyRoutes = require('./history-route')
const currencyRoutes = require('./currency-route')
const coinRoutes = require('./coin-route')
const authRoutes = require('./auth-route')
const {ResponseData} = require('../helpers/response-data')

function route(app) {

  app.use('/api/v1/auth', authRoutes)

  app.use('/api/v1/history', historyRoutes)

  app.use('/api/v1/currency', currencyRoutes)

  app.use('/api/v1/coin', coinRoutes)

  app.use('/', (req, res) => {
    return res.status(404).json(new ResponseData(false, "Not found").toJson())
  })
}

module.exports = route