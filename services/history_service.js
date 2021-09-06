const { History } = require('../models/history_model')
const convertUtil = require('../utils/convert')

async function getListHistoryMinute(currencyfrom, currencyto, limit) {
  let currency_from = currencyfrom
  let currency_to = currencyto
  let limitRecord = limit ?? 1
  let timeFrom = (Math.floor(convertUtil.convertoToMilliseconds(Date.now()) / 60) - limitRecord) * 60
  let timeTo = Math.floor(convertUtil.convertoToMilliseconds(Date.now()) / 60) * 60
  try {
    let filter = {
      currencyfrom: currency_from,
      currencyto: currency_to,
      isminute: true
    }
    let option = {
      createAt: 0,
      updatedAt: 0,
      _v: 0
    }
    let sort = {time: 1}
    return new Promise((resolve, reject) => {
      History
      .find(filter, option)
      .sort(sort)
      .where('time').gte(timeFrom)
      .where('time').lte(timeTo)
      .exec((err , data) => {
        if (err) return reject(err)
        let resData = {
          TimeFrom: timeFrom,
          TimeTo: timeTo,
          data: data || [],
        }
        return resolve(resData)
      })
    })
  } catch (err) {
    throw err
  }
}

async function getListHistoryHour(currencyfrom, currencyto, limit) {
  let currency_from = currencyfrom
  let currency_to = currencyto
  let limitRecord = limit ?? 1
  let timeFrom = (Math.floor(convertUtil.convertoToMilliseconds(Date.now()) / 3600) - limitRecord) * 3600
  let timeTo = Math.floor(convertUtil.convertoToMilliseconds(Date.now()) / 3600) * 3600
  try {
    let filter = {
      currencyfrom: currency_from,
      currencyto: currency_to,
      isminute: false
    }
    let option = {
      createAt: 0,
      updatedAt: 0,
      _v: 0
    }
    let sort = {time: 1}
    return new Promise((resolve, reject) => {
      History
      .find(filter, option)
      .sort(sort)
      .where('time').gte(timeFrom)
      .where('time').lte(timeTo)
      .exec((err , data) => {
        if (err) return reject(err)
        let resData = {
          TimeFrom: timeFrom,
          TimeTo: timeTo,
          data: data || [],
        }
        return resolve(resData)
      })
    })
  } catch (err) {
    throw err
  }
}

module.exports = {
  getListHistoryMinute,
  getListHistoryHour
}