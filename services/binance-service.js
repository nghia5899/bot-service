const config = require('../config/config.js')
const crypto = require('crypto');
const axios = require('axios')

let binanceService = {
  async getHistoryTransfer(time) {
    const query = `timestamp=${time}&recvWindow=60000`
    return await callApiBinance('https://api.binance.com/sapi/v1/asset/get-funding-asset', query)
  },
  async getBalanceFunding(time, wallet) {
    try {
      const query = `timestamp=${time}&recvWindow=60000`
      const res = await callApiBinance('https://api.binance.com/sapi/v1/asset/get-funding-asset', query, wallet)
      if (res) return res.data || []
    } catch (e) {
      //console.log(e)
      return false
    }
  }  
}


function callApiBinance(url, query, wallet) {
  return new Promise((resolve, reject) => {
    const sig = signature(query, wallet)
    const data = query + '&signature=' + sig
    console.log(config.API_KEY)
    const instance = axios.create({
      headers: {
        'X-MBX-APIKEY': wallet.api_key,
      }
    })
    instance.post(url + '?' + data)
      .then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
  })
}

function signature(query_string, wallet) {
    return crypto
        .createHmac('sha256', wallet.api_secret)
        .update(query_string)
        .digest('hex');
}

module.exports = binanceService
