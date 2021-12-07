const { Coin } = require('../models/coin')
const cloneDataModel = require('./clone-data-service')
const request = require('request')
const { getListTransactions } = require('../controllers/coin-controller')
const config = require('../config/config')

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

  async getListTransactions(address, code, contractAddress, network, page, size, fingerprint) {
    try {
      switch (code.toLowerCase()) {
        case 'trx':
          return await getListTransactionsTRX(address, size, page);
        case 'btc':
          return await getListTransactionsBTC(address, page, size);
        case 'eth':
          return await getListTransactionsETH(address, page, size);
        case 'bsc':
          return await getListTransactionsBSC(address, page, size);
        case 'usdt_erc20':
          return await getListTransactionsEthereum(address, '0xdac17f958d2ee523a2206206994597c13d831ec7', 'ethereum', page, size);
        case 'usdt_trc20':
          return await getListTransactionsTRC20(address, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', size, fingerprint);
        case 'matic':
          return await getListTransactionsPolygon(address, page, size);
        case 'ltc':
        case 'doge':
          return await getListTransactionByBlockCypher(address, code, size, page, fingerprint);
        default:
          break;
      }
      switch (network) {
        case 'ethereum':
        case 'binance-smart-chain':
          return await getListTransactionsEthereum(address, contractAddress, network, page, size);
        case 'tron':
          return await getListTransactionsTRC20(address, contractAddress, size, fingerprint);
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
    _id: coin.code,
    code: coin.code,
    price: coin.price,
  })
}

async function getListTransactionsEthereum(address, contractAddress, network, page, size) {
  try {
    URL = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${size}&sort=desc&apikey=${config.ETHER_SCAN_API_KEY}`;
    if (network == 'binance-smart-chain') {
      URL = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${size}&sort=desc&apikey=${config.BSC_SCAN_API_KEY}`;
    }
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response.result;
    if (!Array.isArray(listTransactions)) {
      return [];
    }
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.from,
          "to": item.to,
          "value": item.value,
          "timeStamp": parseInt(item.timeStamp),
          "transaction_id": item.hash,
          "tokenName": item.tokenName,
          "tokenSymbol": item.tokenSymbol,
          "tokenDecimal": parseInt(item.tokenDecimal),
          "type": getTypeTransaction(address, item.from),
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsETH(address, page, size) {
  try {
    URL = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&page=${page}&offset=${size}&sort=desc&apikey=${config.ETHER_SCAN_API_KEY}`;
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response.result;
    if (!Array.isArray(listTransactions)) {
      return [];
    }
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.from,
          "to": item.to,
          "value": item.value,
          "fee": item.gasUsed,
          "timeStamp": parseInt(item.timeStamp),
          "transaction_id": item.hash,
          "tokenName": 'Ethereum',
          "tokenSymbol": 'eth',
          "tokenDecimal": 18,
          "type": getTypeTransaction(address, item.from),
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsBSC(address, page, size) {
  try {
    URL = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&page=${page}&offset=${size}&sort=desc&apikey=${config.BSC_SCAN_API_KEY}`;
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response.result;
    if (!Array.isArray(listTransactions)) {
      return [];
    }
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.from,
          "to": item.to,
          "value": item.value,
          "fee": item.gasUsed,
          "timeStamp": parseInt(item.timeStamp),
          "transaction_id": item.hash,
          "tokenName": 'Ethereum',
          "tokenSymbol": 'eth',
          "tokenDecimal": 18,
          "type": getTypeTransaction(address, item.from),
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsTRC20(address, contractAddress, size, fingerprint) {
  try {
    URL = `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?contract_address=${contractAddress}&limit=${size}&fingerprint=${fingerprint || ''}`;
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response.data;
    if (!Array.isArray(listTransactions)) {
      return [];
    }
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
          "tokenName": item.token_info.name,
          "tokenSymbol": item.token_info.symbol,
          "tokenDecimal": item.token_info.decimals,
          // "type": (item.type || getTypeTransaction(address, item.from)).toLowerCase(),
          "type": getTypeTransaction(address, item.from),
          "fingerprint": response.meta.fingerprint || '',
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsTRX(address, size, page) {
  try {
    URL = `https://apilist.tronscan.org/api/transaction?sort=-timestamp&limit=${size}&start=${size * (page - 1)}&address=${address}`;
    let response = await sendrequest({ uri: URL, method: 'GET' });
    if (!Array.isArray(response.data)) {
      return [];
    }
    var listTransactions = response.data || [];
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.ownerAddress,
          "to": item.toAddress,
          "value": item.amount,
          "fee": item.cost.fee.toString(),
          "timeStamp": Math.floor(item.timestamp / 1000),
          "transaction_id": item.hash,
          "tokenName": 'Tron',
          "tokenSymbol": 'trx',
          "tokenDecimal": 6,
          // "type": (item.type || getTypeTransaction(address, item.ownerAddress)).toLowerCase(),
          "type": getTypeTransaction(address, item.ownerAddress),
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsBTC(address, page, size) {
  try {
    URL = `https://blockchain.info/rawaddr/${address}?limit=${size}&offset=${size * (page - 1)}`;
    let response = await sendrequest({ uri: URL, method: 'GET' })
    if (!Array.isArray(response.txs)) {
      return [];
    }
    var listTransactions = response.txs || [];
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.inputs[0].prev_out.addr,
          "to": item.out[0].addr,
          "transaction_id": item.hash,
          "timeStamp": item.time,
          "fee": item.fee.toString(),
          "value": item.result.toString(),
          "tokenName": 'Bitcoin',
          "tokenSymbol": 'BTC',
          "tokenDecimal": 8,
          "type": getTypeTransaction(address, item.inputs[0].prev_out.addr),
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionsPolygon(address, page, size) {
  try {
    URL = `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&page=${page}&offset=${size}&sort=desc&apikey=${config.POLYGON_SCAN_API_KEY}`;
    let response = await sendrequest({ uri: URL, method: 'GET' })
    var listTransactions = response.result;
    if (!Array.isArray(listTransactions)) {
      return [];
    }
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      result.push(
        {
          "from": item.from,
          "to": item.to,
          "value": item.value,
          "fee": item.gasUsed,
          "timeStamp": parseInt(item.timeStamp),
          "transaction_id": item.hash,
          "tokenName": 'Ethereum',
          "tokenSymbol": 'eth',
          "tokenDecimal": 18,
          "type": getTypeTransaction(address, item.from),
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

async function getListTransactionByBlockCypher(address, code, limit, page, fingerprint) {
  try {
    if (fingerprint.toString().includes('false') || fingerprint == 'endSession') {
      return [];
    }
    var before = '';
    if (page > 1 && Array.isArray(fingerprint.toString().split('_'))) {
      before = `&before=${fingerprint.toString().split('_')[1]}`;
    }
    URL = `https://api.blockcypher.com/v1/${code}/main/addrs/${address}/full?limit=${limit}${before}`;
    let response = await sendrequest({ uri: URL, method: 'GET' });
    console.log(URL);
    var listTransactions = response.txs;
    if (!Array.isArray(listTransactions)) {
      return [];
    }
    var result = [];
    for (var i in listTransactions) {
      const item = listTransactions[i];
      var from = '';
      var to = '';
      var value = 0;
      for (var input of item.inputs) {
        if (input.addresses) {
          if (!from.includes(input.addresses)) {
            from += `${input.addresses}, `;
          }
          if (input.addresses == address) {
            value += input.value || input.output_value;
          }
        }
      }
      for (var output of item.outputs) {
        if (output.addresses) {
          if (!to.includes(output.addresses)) {
            to += `${output.addresses}, `;
          }
          if (output.addresses == address) {
            value -= output.value;
          }
        }
      }
      let type = getTypeTransaction(address, from);
      strRegex = `${address}, `;
      var regex = new RegExp(strRegex, "g");
      result.push(
        {
          "from": type == 'transfer' ? address : (from.replace(regex, '') == '' ? '' : from.replace(regex, '').slice(0, -2)),
          "to": type == 'deposit' ? address : (to.replace(regex, '') == '' ? '' : to.replace(regex, '').slice(0, -2)),
          "value": Math.abs(value).toString(),
          "fee": parseFloat(item.fees).toString(),
          "timeStamp": Math.floor(Date.parse(item.received || item.confirmed) / 1000),
          "transaction_id": item.hash,
          "tokenName": getTokenNameByCode(code),
          "tokenSymbol": code,
          "tokenDecimal": 8,
          "type": type,
          "fingerprint": `${response.hasMore || 'false'}_${item.block_height}`,
        }
      )
    }
    return result;
  } catch (err) {
    console.log(err)
    return null;
  }
}

function getTypeTransaction(address, fromAddress) {
  if (fromAddress.toString().includes(address)) {
    return 'transfer'
  }
  return 'deposit'
}

function getTokenNameByCode(code) {
  switch (code.toLowerCase()) {
    case 'ltc': return 'Litecoin';
    case 'doge': return 'Dogecoin';
  }
  return ''
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
