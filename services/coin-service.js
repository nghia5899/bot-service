const { Coin } = require('../models/coin')
const cloneDataModel = require('./clone-data-service')

let coinService = {

  async getAllCurrency() {
    return new Promise((resolve, reject) => {
      Coin
      .find({}, {_id: 0, createdAt: 0, updatedAt: 0, __v: 0})
      .exec((err, data) => {
        if (err) return reject(err)
        return resolve({data: data})
      })
    })
  },

  async getBalance() {
    try {
      return new Promise((resolve, reject) => {
        Coin.find({}, {_id: 0, __v: 0}, (err, data) => {
          if (err) return reject(err)
          return resolve(data)
        })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  
  async initCoin() {
    try {
      let listCoinData = await Coin.find({}, {_id: 0, _v: 0})
      let listCoin = [];
      if (listCoinData.length) {
        listCoinData.forEach(element => {
          listCoin.push(element.code)
        })
      } else {
        listCoin = ['BTC', 'ETH', 'TRX', 'BNB', 'XRP', 'DOGE']
      }
      let response = await cloneDataModel.listSymbolsPrice(listCoin)
      if (response[1]) {
        if (response[1].Response) return
        let listSymbolsPrice = Object.entries(JSON.parse(response[1]))
        new Map(listSymbolsPrice).forEach((value, key) => {
          let coin = new CoinData({code: key, price: value.USD})
          coin.save((err) => {
            if (err) {
              let filter = {
                code: key
              }
              let update = {$set: {price: value.USD}}
              Coin.collection.findOneAndUpdate(filter, update).catch((err) => {})
            }
          })
        })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  
  addCoin(listCoin) {
    try {
      if (listCoin.length) {
        listCoin.forEach(element => {
          let coin = new CoinData({code: element, price: 0})
          coin.save((err) => {
            if (!err) {
              this.initCoin()
            }
          })
        })
      }
    } catch (e) {
      console.log(e)
    }
  },

  deleteCoin(listCoin) {
    try {
      if (listCoin.length) {
        listCoin.forEach(element => {
          Coin.collection.deleteOne({code: element})
        })
      }
    } catch (e) {
      console.log(e)
    }
  },

  getFee() {
    try {
      return new Promise((resolve, reject) => {
        Coin
        .find({}, {code: 1, isWithdrawable: 1, feeType: 1, feeFrom: 1, feeFix: 1, feePercen: 1, _id: 0})
        .exec((err, data) => {
          if (err) return reject(err)
          return resolve(data)
        })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

function CoinData(coin) {
  return Coin({
    code: coin.code,
    price: coin.price,
  })
}

module.exports = coinService
