const httpClient = require('../http/http-client')
const { Coin } = require('../models/coin')
const StellarSdk = require('stellar-sdk')
const RippleAPI = require('ripple-lib').RippleAPI
// 00001
let _currentRequestId = 1
module.exports = {
  getFee(code) {
    return new Promise(function (resolve, reject) {
      Coin.findOne({ code: code.toUpperCase() }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  },
  getEthFeeWithCode(code) {
    let url
    let defaultFee
    switch (code) {
      case 'ETH': case 'ERC20':
        url = 'https://mainnet.infura.io/v3/ec8ae9db8c5446c8b74fee8b27921097'
        defaultFee = 62546934672
        break
      case 'BSC': case 'BEP20':
        url = 'https://bsc-dataseed.binance.org'
        defaultFee = 5000000000
        break
      case 'ETC':
        url = 'https://www.ethercluster.com/etc'
        defaultFee = 10000000000
        break
      case 'MATIC':
        url = 'https://rpc-mainnet.maticvigil.com'
        defaultFee = 1000000001
        break
      case 'AVAX_CCHAIN':
        url = 'https://api.avax.network/ext/bc/C/rpc'
        defaultFee = 5000000000
        break
      case 'AURORA':
        url = 'https://mainnet.aurora.dev'
        defaultFee = 5000000000
        break
      default:
        break
    }
    return new Promise((resolve, reject) => {
      httpClient.post(url, {
        'jsonrpc': '2.0',
        'method': 'eth_gasPrice',
        'params': [],
        'id': _currentRequestId++
      }).then(rs => {
        resolve(parseInt(rs.data.result, 16) || defaultFee)
      }).catch(rs => {
        console.log(rs)
        reject(defaultFee)
      })
    })
  },
  getXrpFee: function (bodyData) {
    return new Promise(function (resolve, reject) {
      const api = new RippleAPI({
        server: bodyData.isTestnet ? 'wss://s.altnet.rippletest.net:51233' : 'wss://s1.ripple.com'
      })
      api.connect().then(async() => {
        try {
          address = bodyData.txJson.Account
          console.log("Waiting until we have a validated starting sequence number...")
          while (true) {
            try {
              await api.request("account_info", {account: address, ledger_index: "validated"})
              break
            } catch(e) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
          const rawTx = Object.assign({}, bodyData.txJson, { "Amount": api.xrpToDrops(bodyData.txJson['Amount'])})
          const preparedTx = await api.prepareTransaction(rawTx, {
            "maxLedgerVersionOffset": 75
          })
          console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
          resolve(preparedTx.instructions.fee)
        } catch (error) {
          reject(0.00001)
        }
      })
    })
  },
  getXlmFee: function() {
    return StellarSdk.BASE_FEE
  }
}
