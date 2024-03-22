const { Telegraf } = require('telegraf')
const config = require('../config/config.js')
const PATH = require('path')
const bot = new Telegraf(config.BOT_TOKEN_GUEST)

module.exports = {
  sendMessage: async function(message, enable, chatId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (process.env.IGNORE_TELEGRAM_BOT) return resolve()
        if (!enable) return resolve()
        const listChatId = config.LIST_CHAT_ID
        console.log(listChatId)
        for (let i = 0; i < listChatId.length; i += 1) {
          console.log(' --- Bot send ---')
          console.info(message)
          await bot.telegram.sendMessage(listChatId[i], message)
        }
        return resolve()
      } catch (e) {
        console.log(e)
        return resolve()
      }
    })
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
