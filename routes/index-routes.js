const coinRoutes = require('./coin-route')
const {ResponseData} = require('../helpers/response-data')

function route(app) {

  app.use('/api/v1/coin', coinRoutes)

  app.use('/', (req, res) => {
    return res.status(404).json(new ResponseData(false, "Not found").toJson())
  })
}

module.exports = route