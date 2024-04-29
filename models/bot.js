let mongoose = require("mongoose");

let BotSchema = new mongoose.Schema({
  token: {type: String, required:false, default: ''},
  idBot: {type: String, required:false, default: ''},
  status: {type: Boolean, required:false, default: true},
}, {timestamps: true})

var Bot = mongoose.model("Bot", BotSchema)

module.exports = { Bot }
