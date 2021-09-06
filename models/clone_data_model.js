const request = require('request')

var clone_data_model = {}

async function sendrequest(option) {
  return new Promise((resolve, reject) => {
    request(option, function (err, res, body) {
      if (err) reject(err)
      else 
        resolve([res, body])
    })
  })
}

clone_data_model.history_minute = (fromCurrency, toCurrency, limit) => {
  let URL = 'https://min-api.cryptocompare.com/data/v2/histominute?aggregate=1&e=CCCAGG&'+
    'extraParams=https:%2F%2Fwww.cryptocompare.com&fsym='+ fromCurrency +'&limit='+ limit +'&'+
    'tryConversion=false&tsym='+ toCurrency
  return sendrequest({
    uri: URL,
    method: 'GET',
    }
  )
}

clone_data_model.history_hour = (fromCurrency, toCurrency, limit) => {
  let URL = `https://min-api.cryptocompare.com/data/v2/histohour?aggregate=1&e=CCCAGG&'+
    extraParams=https:%2F%2Fwww.cryptocompare.com&fsym=${fromCurrency}&limit=${limit}&
    tryConversion=false&tsym=${toCurrency}`
  return sendrequest({
    uri: URL,
    method: 'GET',
    }
  )
}

clone_data_model.listCoin = (limit, page, tsym) => {
  let URL = `https://min-api.cryptocompare.com/data/top/totaltoptiervol?ascending=true&assetClass=all&extraParams=https:%2F%2Fwww.cryptocompare.com&limit=${limit}&page=${page}&tsym=${tsym}`
  return sendrequest({
    uri: URL,
    method: 'GET',
    }
  )
}


module.exports = clone_data_model