const BigNumber = require('bignumber.js');
module.exports = {
  convertBaseToUUID: function (bin) {
    var hex = new Buffer(bin, 'base64').toString('hex');
    return hex.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, function () {
      return arguments[1] + "-" + arguments[2] + "-" + arguments[3] + "-" + arguments[4] + "-" + arguments[5];
    })
  },
  getRandomeInRange: function (max) {
    const num = Math.floor(Math.random() * max)
    return num + 1
  },
  getBchAddress: function (address) {
    try {
      const arr = address.split(':')
      if (arr.length > 1) {
        return arr[1]
      } else return address
    } catch (error) {
      return address
    }
  },
  generateMinimumBalance: function (precision) {
    if (precision === 0) return 0
    try {
      const str = '000000000000000000000000000000000000000000000000'
      const preNum = str.substr(0, precision - 1) + 1
      return new BigNumber(0 + '.' + preNum).toNumber()
    } catch (error) {
      return 0
    }
  },
  multipliedBy: function (a, b) {
    try {
      const result = new BigNumber(a).multipliedBy(b)
      return result.toNumber()
    } catch (error) {
      return 0
    }
  },
  minus: function (a, b) {
    try {
      const result = new BigNumber(a).minus(b)
      return result.toNumber()
    } catch (error) {
      return 0
    }
  },
  dividedBy: function (a, b) {
    try {
      const result = new BigNumber(a).dividedBy(b)
      return result.toNumber()
    } catch (error) {
      return 0
    }
  },
  roundUp: function (a, precision) {
    try {
      const result = new BigNumber(a).toFixed(precision, 0)
      return new BigNumber(result).toNumber()
    } catch (error) {
      console.log(error)
      return a
    }
  },
  roundDown: function (a, precision) {
    try {
      const result = new BigNumber(a).toFixed(precision, 1)
      return new BigNumber(result).toNumber()
    } catch (error) {
      return a
    }
  }
}
