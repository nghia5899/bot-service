let mongoose = require("mongoose");

let TrxWalletSchema = new mongoose.Schema({
  name: {type: String, required:false, default: ''},
  address: {type: String, required:false, default: ''},
  balance: {type: Number, required:false, default: 0},
  status: {type: Boolean, required:false, default: true},
  statusChange: {type: Boolean, required:false, default: true}
}, {timestamps: true})

var TrxWallet = mongoose.model("TrxWallet", TrxWalletSchema)

module.exports = { TrxWallet }
