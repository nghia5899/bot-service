var mongoose = require("mongoose")
var historyModel = {}

var HistorySchema = new mongoose.Schema({
  time: {type: Number, required: true},
  open: {type: Number, required:false, default: 0},
  close: {type: Number, required:false, default: 0},
  conversionSymbol: {type: String, required: false, default: ''},
  conversionType: {type: String, required: false},
  high: {type: Number, required:false, default: 0},
  low: {type: Number, required:false, default: 0},
  volumefrom: {type: Number, required:false, default: 0},
  volumeto: {type: Number, required:false, default: 0},
  currencyfrom: {type: String, required: false, default: ''},
  currencyto: {type: String, required: false, default: ''},
  isminute: {type: Boolean, required: false, default: true},
},
{
  timestamps: true
}
)

var History = mongoose.model("History", HistorySchema)

History.collection.createIndex({
  time: 1,
  currencyfrom: 1,
  currencyto: 1,
  isminute: 1,
},
{unique: true}
)

module.exports = { historyModel, History}
