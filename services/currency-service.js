const { CoupleCurrency } = require('../models/couple-currency')
const { History } = require('../models/history-model')
const Web3 = require('web3');
const abi = require('erc-20-abi')
const cloneHistoryService = require('./clone-history-service')
const request = require('request')

const LIMIT_1_HOUR = 61
const LIMIT_1_DAY = 1450
const LIMIT_1_WEEK = 169
const LIMIT_1_MONTH = 726

let currencyService = {

  async insertCoupleCurrency(list) {
    try {
      let listCoupleCurrency = list
      listCoupleCurrency.forEach(element => {
        try {
          let currency = new CoupleCurrency(CoupleCurrencyData(element))
          currency.save((err) => {
            if (err) return
            cloneHistoryService.addHistoryMinute(element.currencyFrom, element.currencyTo, LIMIT_1_DAY)
            cloneHistoryService.addHistoryHour(element.currencyFrom, element.currencyTo, LIMIT_1_MONTH)
          })
        } catch (e) {
          console.log(e)
          console.log('Couple currency already exist')
        }
      })
    } catch (e) {
      throw e
    }
  },

  async deleteCoupleCurrency(list) {
    let listCoupleCurrency = list
    listCoupleCurrency.forEach(element => {
      try {
        let filter = {
          currencyfrom: element.currencyFrom,
          currencyto: element.currencyTo,
        }
        CoupleCurrency.collection.deleteOne(filter)
        History.collection.deleteMany(filter)
      } catch (e) {
        throw e
      }
    })
  },

  async initCoupleCurrency() {
    try {
      let listCoupleCurrency = await CoupleCurrency.find({}, { _id: 0, _v: 0 })
      if (!listCoupleCurrency.length) {
        this.insertCoupleCurrency(listCoin)
      } else {
        cloneHistoryService.refreshAllHistory()
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async getTRC20TokenInfo(contractAddress) {
    let URL = `https://apilist.tronscan.org/api/contract?contract=${contractAddress}`;
    let option = {
      uri: URL,
      method: 'GET',
    };
    return new Promise((resolve, reject) => {
      request(option, function (err, res, body) {
        if (err) reject(err)
        else {
          try {
            let result = JSON.parse(body);
            let tokenInfo = result.data[0].tokenInfo;
            if (tokenInfo.tokenAbbr) {
              resolve({
                'name': tokenInfo.tokenName || '',
                'symbol': tokenInfo.tokenAbbr || '',
                'decimals': tokenInfo.tokenDecimal || 0,
                'logo': tokenInfo.tokenLogo || '',
              });
            }
            resolve(null);
          } catch (error) {
            console.log(error);
            resolve(null);
          }
        }
      })
    })
  },

  async getEthereumTokenInfo(contractAddress, networkType) {
    try {
      rpcNetworkURL = '';
      switch (networkType) {
        case 'ethereum': rpcNetworkURL = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'; break;
        case 'binance-smart-chain': rpcNetworkURL = 'https://bsc-dataseed.binance.org'; break;
      }
      //get token info by web3 library
      let tokenName = '';
      let tokenSymbol = '';
      let tokenDecimal = 0;
      if (rpcNetworkURL != '') {
        const web3 = new Web3(rpcNetworkURL);
        const tokenInst = new web3.eth.Contract(abi, contractAddress);
        tokenDecimal = await tokenInst.methods.decimals().call();
        tokenName = await tokenInst.methods.name().call();
        tokenSymbol = await tokenInst.methods.symbol().call();
      } else {
        return null;
      }
      // get token image by Coingecko api
      let logo = await getTokenImageByCoingecko(contractAddress, networkType);
      return {
        'name': tokenName,
        'symbol': tokenSymbol,
        'decimals': tokenDecimal,
        'logo': logo,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

function CoupleCurrencyData(coupleCurrency) {
  return CoupleCurrency({
    currencyfrom: coupleCurrency.currencyFrom,
    currencyto: coupleCurrency.currencyTo,
  })
}

async function getTokenImageByCoingecko(contractAddress, networkType) {
  try {
    let URL = `https://api.coingecko.com/api/v3/coins/${networkType}/contract/${contractAddress}`;
    let option = {
      uri: URL,
      method: 'GET',
    };
    let response = await new Promise((resolve, reject) => {
      request(option, function (err, res, body) {
        if (err) reject(err)
        else {
          resolve(body);
        }
      })
    });
    let result = JSON.parse(response);
    return result.image.small || (result.image.thumb || '');
  } catch (err) {
    console.log(err)
    return '';
  }
}

module.exports = currencyService