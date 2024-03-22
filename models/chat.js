let mongoose = require("mongoose");

let ChatSchema = new mongoose.Schema({
  chatId: {type: String, required:false, default: ''},
  isGuest: {type: Boolean, required:false, default: false},
}, {timestamps: true})

var Chat = mongoose.model("Chat", ChatSchema)

module.exports = { Chat }
