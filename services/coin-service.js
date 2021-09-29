const { Coin } = require('../models/coin')
const cloneDataModel = require('./clone-data-service')
const request = require('request')
const { getListTransactions } = require('../controllers/coin-controller')

let coinService = {

  async getAllCurrency() {
    return new Promise((resolve, reject) => {
      Coin
        .find({}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        .exec((err, data) => {
          if (err) return reject(err)
          return resolve({ data: data })
        })
    })
  },

  async getBalance() {
    try {
      return new Promise((resolve, reject) => {
        Coin.find({}, { _id: 0, __v: 0 }, (err, data) => {
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
      let listCoinData = await Coin.find({}, { _id: 0, _v: 0 })
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
        let listSymbolsPrice = Object.entries(response[1])
        new Map(listSymbolsPrice).forEach((value, key) => {
          let coin = new CoinData({ code: key, price: value.USD })
          coin.save((err) => {
            if (err) {
              let filter = {
                code: key
              }
              let update = { $set: { price: value.USD } }
              Coin.collection.findOneAndUpdate(filter, update).catch((err) => { })
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
          let coin = new CoinData({ code: element, price: 0 })
          coin.save((err) => { })
        })
        this.initCoin()
      }
    } catch (e) {
      console.log(e)
    }
  },

  deleteCoin(listCoin) {
    try {
      if (listCoin.length) {
        listCoin.forEach(element => {
          Coin.collection.deleteOne({ code: element })
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
          .find({}, { code: 1, isWithdrawable: 1, feeType: 1, feeFrom: 1, feeFix: 1, feePercent: 1, _id: 0 })
          .exec((err, data) => {
            if (err) return reject(err)
            return resolve(data)
          })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  getCurrencyByCode(code) {
    return new Promise((resolve, reject) => {
      Coin.findOne({ code: code.toUpperCase() }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  },

  async getListTransactions(address, contractAddress, network, page, size, fingerprint) {
    try {
      switch (network) {
        case 'ethereum':
        case 'binance-smart-chain':
          return await getListTransactionsEthereum(address, contractAddress, network, page, size);
        case 'tron':
          return await getListTransactionsTron(address, contractAddress, size, fingerprint);
        case 'btc':
          return await getListTransactionsBTC(address);
        default:
          break;
      }
      return null;
    } catch (err) {
      console.log(err)
      return null;
    }
  },
}

function CoinData(coin) {
  return Coin({
    code: coin.code,
    price: coin.price,
  })
}

async function getListTransactionsEthereum(address, contractAddress, network, page, size) {
  try {
    URL = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${size}&sort=desc&apikey=QDW5I33I3XG8AP7A2GWWJEGXW8K3H3JTUU`;
    if (network == 'binance-smart-chain') {
      URL = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${size}&sort=desc&apikey=W8V2XYWK3IWRP53ZB2VX7T2UNKKHBAIEBC`;
    }
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response?.result;
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.from,
          "to": item.to,
          "value": item.value,
          "timeStamp": item.timeStamp,
          "transaction_id": item.hash,
          "tokenName": item.tokenName,
          "tokenSymbol": item.tokenSymbol,
          "tokenDecimal": item.tokenDecimal,
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsTron(address, contractAddress, size, fingerprint) {
  try {
    URL = `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?contract_address=${contractAddress}&limit=${size}&fingerprint=${fingerprint ?? ''}`;
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response?.data;
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.from,
          "to": item.to,
          "value": item.value,
          "timeStamp": Math.floor(item.block_timestamp / 1000),
          "transaction_id": item.transaction_id,
          "tokenName": item?.token_info?.name,
          "tokenSymbol": item?.token_info?.symbol,
          "tokenDecimal": item?.token_info?.decimals,
          "type": item.type,
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsBTC(address) {
  try {
    URL = `https://blockchain.info/rawaddr/${address}`;
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response?.txs;
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.inputs[0]?.prev_out?.addr,
          "to": item.out[0]?.addr,
          "transaction_id": item.hash,
          "timeStamp": item.time,
          "fee": item.fee,
          "value": item.result,
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function sendrequest(option) {
  return new Promise((resolve, reject) => {
    request(option, function (err, res, body) {
      if (err) reject(err)
      else
        resolve(JSON.parse(body))
    })
  })
}

module.exports = coinService
