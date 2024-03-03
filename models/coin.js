let mongoose = require("mongoose");

let CoinSchema = new mongoose.Schema({
  idWallet: {type: String, required:false, default: ''},
  typeWallet: {type: String, required:false, default: ''},
  code: {type: String, required:false, default: ''},
  amount: {type: Number, required:false, default: 0},
}, {timestamps: true})

var Coin = mongoose.model("Coin", CoinSchema)

module.exports = { Coin }
