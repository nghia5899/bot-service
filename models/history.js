let mongoose = require("mongoose");

let HistorySchema = new mongoose.Schema({
  type: {type: String, required:false, default: ''},
  idTx: {type: String, required:false, default: ''},
  insertTime: {type: Number, required:false, default: 0},
}, {timestamps: true})

var History = mongoose.model("History", HistorySchema)

module.exports = { History }
