const { Telegraf } = require('telegraf')
const config = require('../config/config.js')
const PATH = require('path')
const bot = new Telegraf(config.BOT_TOKEN_TRX_WALLET_CLIENT)
const { Chat } = require('../models/chat.js')
const axios = require('axios')

module.exports = {
  sendMessage: async function(message, enable, chatId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (process.env.IGNORE_TELEGRAM_BOT) return resolve()
        //if (!enable) return resolve()
        if (!bot.botInfo) {
          bot.botInfo = await bot.telegram.getMe()
        }
        const id = bot.botInfo.id
        const listChatId = await Chat.find({idBot: id})
        console.log(listChatId)
        for (let i = 0; i < listChatId.length; i += 1) {
          console.log(' --- Bot send ---')
          console.info(message)
          if (listChatId[i].isGuest) {
            bot.telegram.sendMessage(listChatId[i].chatId, message).catch(function(e) {})
          }
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
  },
  listenChatId: async function(token) {
    try {
      const res = await callApiUpdate(token)
      if (res.data.ok != true) return
      const listUpdate = res.data.result
      const me = await bot.telegram.getMe()
      const id = me.id
      let join = {}
      let left = {}
      for (let i = listUpdate.length - 1; i >= 0; i--) {
        try {
          if (listUpdate[i]["my_chat_member"]["new_chat_member"]["status"] == "member") {
            const chatId = listUpdate[i].my_chat_member.chat.id
            try {
              if (left[chatId] == true) continue
              if (join[chatId] == true) continue
            } catch (e) {
              
            }
            join[chatId] = true
            const chat = await Chat.findOne({chatId: chatId, idBot: id})
            if (chat) continue
            const response = await Chat({
              chatId: chatId,
              idBot: id
            }).save()
            console.log('Bot-admin - Add chat: ', chatId , '- title: ', listUpdate[i]["my_chat_member"]["chat"]["title"])
          } else if (listUpdate[i]["my_chat_member"]["new_chat_member"]["status"] == "left") {
            const chatId = listUpdate[i].my_chat_member.chat.id
            try {
              if (join[chatId] == true) continue
              if (left[chatId] == true) continue
            } catch (e) {
              
            }
            left[chatId] = true
            const chat = await Chat.findOne({chatId: chatId, idBot: id})
            if (chat) {
              const res = await chat.remove(function(e) {})
              //const res = await Chat.findOneAndDelete({chatId: chatId, idBot: id}, function(err) {}); 
              console.log('Bot-admin - Delete chat: ', chatId,  '- title: ', listUpdate[i]["my_chat_member"]["chat"]["title"])
            }
          }
        } catch (e) {
          continue
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

function callApiUpdate(token) {
  return new Promise((resolve, reject) => {
    const instance = axios.create()
    instance.post(`https://api.telegram.org/bot${token}/getUpdates`)
      .then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
  })
}

var sleepSetTimeout_ctrl;
function sleep(ms) {
  clearInterval(sleepSetTimeout_ctrl);
  return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}


function logger(error) {
  let matchstack = error.stack.match(/\(.*?\)/g) || []
  let line = matchstack[0] || ""
  let fileAndLine = line.substring(line.lastIndexOf(PATH.sep) + 1, line.length - 1)
  return fileAndLine + ' \n' + error
}
