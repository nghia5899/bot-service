let mongoose = require("mongoose");

let coupleCurrencyModel = {}

let CoupleCurrencySchema = new mongoose.Schema({
  currencyfrom: {type: String, required: false, default: ''},
  currencyto: {type: String, required: false, default: ''},
}, 
{
  timestamps: true,
});

var CoupleCurrency = mongoose.model("CoupleCurrency", CoupleCurrencySchema)
// CoupleCurrency.collection.createIndex({
//   currencyfrom: 1,
//   currencyto: 1,
// },
//   {unique: true}
// )


module.exports = { coupleCurrencyModel, CoupleCurrency }
