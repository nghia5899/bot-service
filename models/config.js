let mongoose = require("mongoose");

let ConfigSchema = new mongoose.Schema({
  statusBalanceChange: {type: Boolean, required:false, default: false},
  apiKey: {type: String, required:false, default: false},
}, {timestamps: true})

var Config = mongoose.model("Config", ConfigSchema)

module.exports = { Config }
