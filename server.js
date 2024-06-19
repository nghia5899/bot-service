const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const route = require('./routes/index-routes')
const path = require('path')
const app = express();
const cors = require('cors')
const coinService = require('./services/coin-service')
const walletService = require('./services/wallet-service')
const binanceService = require('./services/binance-service')
const jobService = require('./services/job-service')
const bot = require('./bot/bot-service')
const config = require('./config/config')
const {Config } = require('./models/config')
const Binance = require('node-binance-api');

const port = 3006;

require('./config/init-mongodb')

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(express.json())

app.use(cors())

route(app);

initConfig()

jobService.startJobGetBalances()

//bot.listenChatId('6649320854:AAFv3PT6c3BCNMJHb4bK2nI-bh1y3yBTW4Y')

//jobService.updateTimeBalance(2)

//alletService.checkBalanceUSDT_TRC20()


app.listen(port, function() {
    console.log('Node server running @ http://localhost:'+ port + '...')
})

async function initConfig() {
    let res = await Config.findOne({})
    if (!res) {
        Config({
            statusBalanceChange: true,
            apiKey: '111111'
        }).save()
    }
}

async function test() {
    const binance = new Binance().options({
        APIKEY: 'Pl9c0X7iBKHnVHsSDYCkyr6Hv4ln6zLHgBjJCbaYiw28tOYvMd7nSxuX6IXPFx4s',
        APISECRET: '6vHbbWHxyJ2tIG7OMzUtOtQI6TAWXYh7uAqsL1gaOPTuqbxKgxhOyFXxz3YLV7KC',
        'family': 4,
        'tld':'us',
        useServerTime: true,
        recvWindow: 5000, // Set a higher recvWindow to increase response timeout
        verbose: true, // Add extra output when subscribing to WebSockets, etc
        log: log => {
          console.log(log); // You can create your own logger here, or disable console output
        }
      });
    const time = await binance.useServerTime();
    console.log('test')
    const res = await binanceService.getBalanceWallet(time.serverTime, {api_secret: '6vHbbWHxyJ2tIG7OMzUtOtQI6TAWXYh7uAqsL1gaOPTuqbxKgxhOyFXxz3YLV7KC',api_key: 'Pl9c0X7iBKHnVHsSDYCkyr6Hv4ln6zLHgBjJCbaYiw28tOYvMd7nSxuX6IXPFx4s'})
    const res1 = await binanceService.getBalanceEarn(time.serverTime, {api_secret: '6vHbbWHxyJ2tIG7OMzUtOtQI6TAWXYh7uAqsL1gaOPTuqbxKgxhOyFXxz3YLV7KC',api_key: 'Pl9c0X7iBKHnVHsSDYCkyr6Hv4ln6zLHgBjJCbaYiw28tOYvMd7nSxuX6IXPFx4s'})
    const res2 = await binanceService.getAvgBtc('', {api_secret: '6vHbbWHxyJ2tIG7OMzUtOtQI6TAWXYh7uAqsL1gaOPTuqbxKgxhOyFXxz3YLV7KC',api_key: 'Pl9c0X7iBKHnVHsSDYCkyr6Hv4ln6zLHgBjJCbaYiw28tOYvMd7nSxuX6IXPFx4s'})
    console.log(res)
    console.log(res1)
    console.log(res2)
    console.log(res[6].balance * res2.price)
}

//test()
