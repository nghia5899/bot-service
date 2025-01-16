const { Telegraf } = require('telegraf')

const bot = new Telegraf('7574115631:AAHIsfbC4O6ZnDDXgCeirPrGcdMwxBlWftw')

module.exports = {
  sendMessage: async function(message) {
    return new Promise(async (resolve, reject) => {
      bot.telegram.sendMessage("-4785530431", message)
    })
  }
}