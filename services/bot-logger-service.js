const { Telegraf } = require('telegraf')
const config = require('../config/config.js')

const bot = new Telegraf(config.BOT_TOKEN)

module.exports = {
  sendMessage: function(message) {
    try {
      if (process.env.IGNORE_TELEGRAM_BOT) return
      bot.telegram.sendMessage(config.CHAT_ID, message)
    } catch (e) {
      console.log(e)
    }
  }
}