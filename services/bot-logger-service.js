const { Telegraf } = require('telegraf')
const config = require('../config/config.js')

const bot = new Telegraf(config.BOT_TOKEN)

module.exports = {
  sendMessage: function(message) {
    try {
      bot.telegram.sendMessage(config.CHAT_ID, message)
    } catch (e) {
      console.log(e)
    }
  }
}