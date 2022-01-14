let mongoose = require("mongoose")

let MarketSchema = new mongoose.Schema({
  _id: {type: String, required:false, default: ''},
  code: {type: String, required:false, default: ''},
  price: {type: Number, required:false, default: 0},
}, {timestamps: true})

var Market = mongoose.model("Market", MarketSchema)

module.exports = { Market }
