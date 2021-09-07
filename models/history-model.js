var mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose)
var historyModel = {}

var HistorySchema = new mongoose.Schema({
  _id: {type: Number},
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
HistorySchema.plugin(AutoIncrement)

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
