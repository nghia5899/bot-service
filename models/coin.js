let mongoose = require("mongoose");

let CoinSchema = new mongoose.Schema({
  _id: {type: String, required:false, default: ''},
  code: {type: String, required:false, default: ''},
  price: {type: Number, required:false, default: 0},
  isWithdrawable: {type: Boolean, required: false, default: true},
  feeType: {type: Number, required:false, default: 0},
  feeFrom: {type: String, required:false, default: '',},
  feeFix: {type: Number, required:false, default: null},
  feePercent: {type: Number, required:false, default: null},
  coinType: {type: String, required:false, default: null}
}, {timestamps: true})

var Coin = mongoose.model("Coin", CoinSchema)

module.exports = { Coin }
