const { Coin } = require('../models/coin')

async function getAllCurrency(reqSize, reqPage) {
  let size = reqSize || 20
  let page = reqPage || 1
  let totalRecords
  let totalPages
  return new Promise((resolve, reject) => {
    Coin
    .find({}, {_id: 0})
    .skip((size * page) - size)
    .limit(parseInt(size))
    .sort('Id')
    .exec((err, data) => {
      if (err) return reject(err)
      Coin.countDocuments((err, count) => {
        if (err) return reject(err)
        totalRecords = count
        totalPages = Math.ceil(count / size)
        let pagination = {
          page: page,
          size: size,
          totalPages: totalPages,
          totalRecords: totalRecords,
        }
        return resolve({data: data, pagination: pagination})
      })
    })
  })
  }

  async function initCoin() {
    try {
      for (let i = 0; i <= 2; i++) {
        let response = await clone_data_model.listCoin(100, i, 'USD')
        if (response[1] != null && response[1] != []) {
          let listTime = JSON.parse(response[1]).Data
          listTime.forEach(element => {
            Coin.collection.insertOne(new Coin(element.CoinInfo)).catch((err) => {
              let filter = {
                Id: element.CoinInfo.Id
              }
              let update = {$set: element.CoinInfo}
              History.collection.findOneAndUpdate(filter, update).catch((err) => {
                console.log(err)
              })
            })
          })
        }
      }
      apiResponse.successResponse(res, "Add list coin success")
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  function addCoin(req, res) {
    res.json({
      status: 'post'
    })
  }

  function deleteCoin(req, res) {
    res.json({
      status: 'delete'
    })
  }


module.exports = {
  getAllCurrency,
  addCoin,
  deleteCoin,
  initCoin
}
