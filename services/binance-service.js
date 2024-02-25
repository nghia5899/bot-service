const config = require('../config/config.js')
const crypto = require('crypto');
const axios = require('axios')

let binanceService = {
  async getHistoryTransfer(time) {
    const query = `timestamp=${time}&recvWindow=60000`
    return await callApiBinance('https://api.binance.com/api/v3/account', query)
  } 
}


function callApiBinance(url, query) {
  return new Promise((resolve, reject) => {
    const sig = signature(query)
    const data = query + '&signature=' + sig
    console.log(data)
    const instance = axios.create({
      headers: {
        'X-MBX-APIKEY': config.API_KEY,
      }
    })
    instance.get(url + '?' + data)
      .then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
  })
}

function signature(query_string) {
    return crypto
        .createHmac('sha256', config.API_SECRET)
        .update(query_string)
        .digest('hex');
}

module.exports = binanceService
