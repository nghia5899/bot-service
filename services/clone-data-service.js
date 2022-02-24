const request = require('request')
const config = require('../config/config')

let cloneDataModel = {
  historyMinute(fromCurrency, toCurrency, limit) {
    let URL = 'https://min-api.cryptocompare.com/data/v2/histominute?aggregate=1&e=CCCAGG&'+
      'extraParams=https:%2F%2Fwww.cryptocompare.com&fsym='+ fromCurrency +'&limit='+ limit +'&'+
      'tryConversion=false&tsym='+ toCurrency
    return sendrequest({
      uri: URL,
      method: 'GET',
      headers: {
        'authorization': `Apikey ${config.API_KEY}`
        }
      }
    )
  },

  historyHour(fromCurrency, toCurrency, limit) {
    let URL = `https://min-api.cryptocompare.com/data/v2/histohour?aggregate=1&e=CCCAGG&'+
      extraParams=https:%2F%2Fwww.cryptocompare.com&fsym=${fromCurrency}&limit=${limit}&
      tryConversion=false&tsym=${toCurrency}`
    return sendrequest({
      uri: URL,
      method: 'GET',
      headers: {
        'authorization': `Apikey ${config.API_KEY}`
        }
      },
    )
  },
  
  listCoin(limit, page, tsym) {
    let URL = `https://min-api.cryptocompare.com/data/top/totaltoptiervol?ascending=true&assetClass=all&extraParams=https:%2F%2Fwww.cryptocompare.com&limit=${limit}&page=${page}&tsym=${tsym}`
    return sendrequest({
      uri: URL,
      method: 'GET',
      headers: {
        'authorization': `Apikey ${config.API_KEY}`
        }
      },
    )
  },

  listSymbolsPrice(listCoin) {
    let str = '';
    listCoin.forEach(element => {
      str += (element + ',')
    })
    str = str.substring(0, str.length - 1)
    let URL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`
    return sendrequest({
      uri: URL,
      method: 'GET',
      headers: {
        'authorization': `Apikey ${config.API_KEY}`
        }
      }
    )
  }
  
}

async function sendrequest(option) {
  return new Promise((resolve, reject) => {
    request(option, function (err, res, body) {
      if (err) reject(err)
      else 
        resolve([res, JSON.parse(body)])
    })
  })
}


module.exports = cloneDataModel
