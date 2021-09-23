let mongoose = require("mongoose");

let CoinSchema = new mongoose.Schema({
  code: {type: String, required:false, default: ''},
  price: {type: Number, required:false, default: 0},
  isWithdrawable: { type: Boolean, required:false, default: false}
}, {timestamps: true});

var Coin = mongoose.model("Coin", CoinSchema)
Coin.collection.createIndex({
  code: 1
},
{unique: true}
)


module.exports = { Coin }
