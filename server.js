const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const route = require('./routes/index-routes')
const path = require('path')
const app = express();
const cors = require('cors')
const logger = require('./helpers/logger')('Node server')
const botLoggerService = require('./services/bot-logger-service')

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
