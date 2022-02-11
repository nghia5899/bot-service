const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const route = require('./routes/index-routes')
const path = require('path')
const currencyService = require('./services/currency-service')
const coinService = require('./services/coin-service')
const app = express();
const cors = require('cors')

const port = 3005;

require('./config/init-mongodb')

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(express.json())

app.use(cors())

route(app);

app.listen(port, function() {
    console.log('Node server running @ http://localhost:'+ port + '...')
})
