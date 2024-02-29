let mongoose = require("mongoose");

let WalletSchema = new mongoose.Schema({
  name: {type: String, required:false, default: ''},
  api_key: {type: String, required:false, default: ''},
  api_secret: {type: String, required:false, default: ''},
  status: {type: Boolean, required:false, default: true}
}, {timestamps: true})

var Wallet = mongoose.model("Wallet", WalletSchema)

module.exports = { Wallet }
