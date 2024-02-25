const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const route = require('./routes/index-routes')
const path = require('path')
const app = express();
const cors = require('cors')
const coinService = require('./services/coin-service')
const jobService = require('./services/job-service')

const port = 3006;

require('./config/init-mongodb')

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(express.json())

app.use(cors())

route(app);

coinService.getHistoryDeposit()

jobService.startJobGetBalances()

app.listen(port, function() {
    console.log('Node server running @ http://localhost:'+ port + '...')
})
