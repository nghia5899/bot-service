const { Telegraf } = require('telegraf')
const config = require('../config/config.js')
const coinService = require('./coin-service')
const { Config } = require('../models/config')
const PATH = require('path')
const bot = new Telegraf(config.BOT_TOKEN)
const {message } = require('telegraf/filters')

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.on(message('text'),async (ctx) => {
  try {
    const chatId = ctx.message.chat.id
    console.log(ctx.message)
    if (ctx.message.text.match(/enable/)) {
      const strings = ctx.message.text.split('/')
      let config = await Config.findOne({})
      console.log(config)
      for (let i = 0 ; i < strings.length; i++) {
        if (strings[i] = config.apiKey) {
          Config.findOneAndUpdate({_id: config.id}, {statusBalanceChange: true}, function(err) {
            if (err) console.log(err)
          })
        }
      }
    } else if (ctx.message.text.match(/disable/)) {
      const strings = ctx.message.text.split('/')
      let config = await Config.findOne({})
      console.log(config)
      for (let i = 0 ; i < strings.length; i++) {
        if (strings[i] = config.apiKey) {
          Config.findOneAndUpdate({_id: config.id}, {statusBalanceChange: false}, function(err) {
            if (err) console.log(err)
          })
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
})

/* bot.on(message('text'), async (ctx) => {
  // Explicit usage
  console.log(ctx.message)
  ctx.telegram.sendMessage(chatId, ctx.message.text)
})
 */
bot.launch()

module.exports = {
  sendMessage: function(message, enable) {
    try {
      if (process.env.IGNORE_TELEGRAM_BOT) return
      if (!enable) return
      const listChatId = config.LIST_CHAT_ID
      for (let i = 0; i < listChatId.length; i += 1) {
        console.log(' --- Bot send ---')
        console.info(message)
        bot.telegram.sendMessage(listChatId[i], message)
      }
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
