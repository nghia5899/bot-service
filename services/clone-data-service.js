const request = require('request')

let cloneDataModel = {
  historyMinute(fromCurrency, toCurrency, limit) {
    let URL = 'https://min-api.cryptocompare.com/data/v2/histominute?aggregate=1&e=CCCAGG&'+
      'extraParams=https:%2F%2Fwww.cryptocompare.com&fsym='+ fromCurrency +'&limit='+ limit +'&'+
      'tryConversion=false&tsym='+ toCurrency
    return sendrequest({
      uri: URL,
      method: 'GET',
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
      }
    )
  },
  
  listCoin(limit, page, tsym) {
    let URL = `https://min-api.cryptocompare.com/data/top/totaltoptiervol?ascending=true&assetClass=all&extraParams=https:%2F%2Fwww.cryptocompare.com&limit=${limit}&page=${page}&tsym=${tsym}`
    return sendrequest({
      uri: URL,
      method: 'GET',
      }
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
      }
    )
  }
  
}

async function sendrequest(option) {
  return new Promise((resolve, reject) => {
    request(option, function (err, res, body) {
      if (err) reject(err)
      else 
        resolve([res, body])
    })
  })
}


module.exports = cloneDataModel
