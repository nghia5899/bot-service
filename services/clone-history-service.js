const { History} = require('../models/history-model')
const cloneDataModel = require('./clone-data-service')
const { CoupleCurrency } = require('../models/couple-currency')

const LIMIT_1_HOUR = 61
const LIMIT_1_DAY = 1450
const LIMIT_1_WEEK = 169
const LIMIT_1_MONTH = 726

let CloneHistoryService = {
  async addHistoryMinute(currencyFrom, currencyTo, limit) {
    try {
      let response = await cloneDataModel.historyMinute(currencyFrom, currencyTo, limit)
      if (response[1]) {
        let listTime = JSON.parse(response[1]).Data.Data
        if (listTime.length) {
          for (let i = listTime.length - 1; i >= 0; i--) {
            let history = new History(HistoryData(listTime[i],currencyFrom,currencyTo, true))
            history.save((err) => {
              if (err) {
                let filter = {
                  time: parseInt(listTime[i].time),
                  isminute: true,
                  currencyfrom: currencyFrom,
                  currencyto: currencyTo,
                }
                let update = {$set: {
                  conversionType: listTime[i].conversionType,
                  high: listTime[i].high,
                  low: listTime[i].low,
                  volumefrom: listTime[i].volumefrom,
                  volumeto: listTime[i].volumeto,
                }}
                History.collection
                  .findOneAndUpdate(filter, update, {new: true})
                  .catch((err) => {
                    console.log(err)
                  })
              }
            })
          }
        }
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async addHistoryHour(currencyFrom, currencyTo, limit) {
    try {
      let response = await cloneDataModel.historyHour(currencyFrom, currencyTo, limit)
      if (response[1] != null && response[1] != []) {
        let listTime = JSON.parse(response[1]).Data.Data
        if (listTime.length != undefined && listTime.length != 0) {
          for (let i = listTime.length - 1; i >= 0; i--) {
            let history = new History(HistoryData(listTime[i],currencyFrom,currencyTo, false))
            history.save((err) => {
              if (err) {
                let filter = {
                  time: parseInt(listTime[i].time),
                  isminute: false,
                  currencyfrom: currencyFrom,
                  currencyto: currencyTo,
                }
                let update = {$set: {
                  conversionType: listTime[i].conversionType,
                  high: listTime[i].high,
                  low: listTime[i].low,
                  volumefrom: listTime[i].volumefrom,
                  volumeto: listTime[i].volumeto,
                }}
                History.collection
                  .findOneAndUpdate(filter, update, {new: true})
                  .catch((err) => {
                    console.log(err)
                  })
              }
            })
          }
        }
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  
  async deleteLastHistoryMinute() {
    try {
      let filter = {isminute: true}
      let option = {time: 1, _id: 0}
      let sort = {time: 1}
      History
        .findOne(filter, option)
        .sort(sort)
        .limit(1)
        .exec((err , data) => {
          if (err) throw err
          if (data != null) {
            let filter = {
              time: data.time,
              isminute: true,
            }
            History.collection.deleteMany(filter)
          }
        })
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  
  async deleteLastHistoryHour() {
    try {
      let filter = {isminute: false}
      let option = {time: 1, _id: 0}
      let sort = {time: 1}
      History
        .findOne(filter, option)
        .sort(sort)
        .limit(1)
        .exec((err , data) => {
          if (err != null) return
          if (data) {
            let filter = {
              time: data.time,
              isminute: false,
            }
            History.collection.deleteMany(filter)
          }
        })
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  
  async refreshAllHistory() {
    try {
      History.collection.deleteMany().then((response) => {
        CoupleCurrency.find().then((list) => {
          list.forEach(element => {
            this.addHistoryMinute(element.currencyfrom, element.currencyto, LIMIT_1_DAY)
            this.addHistoryHour(element.currencyfrom, element.currencyto, LIMIT_1_MONTH)
          })
        })
      })
    } catch (e) {
      throw e
    }
  },
  
  async jobAddHistoryMinute() {
    try {
      let listCoupleCurrency = await CoupleCurrency.find({}, {_id: 0})
      listCoupleCurrency.forEach(element => {
        this.addHistoryMinute(element.currencyfrom, element.currencyto, 5)
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  
  async jobAddHistoryHour() {
    try {
      let listCoupleCurrency = await CoupleCurrency.find({}, {_id: 0})
      listCoupleCurrency.forEach(element => {
        this.addHistoryHour(element.currencyfrom, element.currencyto, 5)
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  }

}

function HistoryData(data, currencyFrom, currencyTo, isMinute) {
  return History({
    time: data.time,
    open: data.open,
    close: data.close,
    conversionSymbol: data.conversionSymbol,
    conversionType: data.conversionType,
    high: data.high,
    low: data.low,
    volumefrom: data.volumefrom,
    volumeto: data.volumeto,
    currencyfrom: currencyFrom,
    currencyto: currencyTo,
    isminute: isMinute,
  })
}

module.exports = CloneHistoryService
