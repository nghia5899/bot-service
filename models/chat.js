let mongoose = require("mongoose");

let ChatSchema = new mongoose.Schema({
  chatId: {type: String, required:false, default: ''},
  isGuest: {type: Boolean, required:false, default: true},
  idBot: {type: Number, required:false, default: ''}
}, {timestamps: true})

var Chat = mongoose.model("Chat", ChatSchema)

module.exports = { Chat }
