const { Telegraf } = require('telegraf')
const config = require('../config/config.js')
const PATH = require('path')
const bot = new Telegraf(config.BOT_TOKEN)

module.exports = {
  sendMessage: function(message) {
    try {
      if (process.env.IGNORE_TELEGRAM_BOT) return
      bot.telegram.sendMessage(config.CHAT_ID, message)
    } catch (e) {
      console.log(e)
    }
  },
  sendErrorMessage: function(error) {
    try {
      if (process.env.IGNORE_TELEGRAM_BOT) return
      bot.telegram.sendMessage(config.CHAT_ID, logger(error))
    } catch (e) {
      console.log(e)
    }
  }
}

function logger(error) {
  let matchstack = error.stack.match(/\(.*?\)/g) || []
  let line = matchstack[0] || ""
  let fileAndLine = line.substring(line.lastIndexOf(PATH.sep) + 1, line.length - 1)
  return fileAndLine + ' \n' + error
}
