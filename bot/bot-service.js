const coinService = require('../services/coin-service')
const jobService = require('../services/job-service.js')
const { Telegraf } = require('telegraf')
const config = require('../config/config.js')
const PATH = require('path')
const bot = new Telegraf(config.BOT_TOKEN)
const {message } = require('telegraf/filters')
const { Wallet } = require('../models/wallet')
const { Chat } = require('../models/chat')
const botLoggerService = require('./bot-logger-service');

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.on(message('text'), async (ctx) => {
  try {
    const chatId = ctx.message.chat.id
    console.log(ctx)
    if (ctx.message.text.match(/balanceChange/)) {
      if (ctx.message.text.match(/enable/)) {
        return enableBalanceChange(ctx)
      } else if (ctx.message.text.match(/disable/)) {
        return disableBalanceChange(ctx)
      } else {
        ctx.telegram.sendMessage(chatId, 'Định dạng không đúng')
        return
      }
    }
    else if (ctx.message.text.match(/balance/)) {
      if (ctx.message.text.match(/enable/)) {
        return enableBalance(ctx)
      } else if (ctx.message.text.match(/disable/)) {
        return disableBalance(ctx)
      } else {
        ctx.telegram.sendMessage(chatId, 'Định dạng không đúng')
        return
      }
    }  else if (ctx.message.text.match(/wallet/)) {
      if (ctx.message.text.match(/add/)) {
        return addWallet(ctx)
      } else if (ctx.message.text.match(/delete/)) {
        return deleteWallet(ctx)
      } else if (ctx.message.text.match(/update/)) {
        return updateWallet(ctx)
      }  else if (ctx.message.text.match(/list/)) {
        return listWallet(ctx)
      } else if (ctx.message.text.match(/report/)) {
        return report(ctx)
      } else {
        ctx.telegram.sendMessage(chatId, 'Định dạng không đúng')
        return
      }
    }  else if (ctx.message.text.match(/time/)) {
      if (ctx.message.text.match(/hour/)) {
        return updateTime(ctx)
      } else if (ctx.message.text.match(/minute/)) {
        return updateTimeMinute(ctx)
      } else {
        ctx.telegram.sendMessage(chatId, 'Định dạng không đúng')
        return
      }
    } else if (ctx.message.text.match(/chat/)) {
      if (ctx.message.text.match(/add/)) {
        return addChat(ctx)
      } else if (ctx.message.text.match(/delete/)) {
        return deleteChat(ctx)
      } else if (ctx.message.text.match(/update/)) {
        return updateChat(ctx)
      } else if (ctx.message.text.match(/enable/)) {
        return updateGuestChat(ctx, true)
      } else if (ctx.message.text.match(/disable/)) {
        return updateGuestChat(ctx, false)
      } else if (ctx.message.text.match(/list/)) {
        return listChat(ctx)
      } else {
        ctx.telegram.sendMessage(chatId, 'Định dạng không đúng')
        return
      }
    } 
    else {
      ctx.telegram.sendMessage(chatId, 'Định dạng không đúng')
      return
    }
  } catch (e) {
    console.log(e)
    return
  }
})

async function enableBalance(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const res = await coinService.enableWallet(strings)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function disableBalance(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const res = await coinService.disableWallet(strings)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function enableBalanceChange(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const res = await coinService.enableBalanceChange(strings)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function disableBalanceChange(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const res = await coinService.disableBalanceChange(strings)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function addWallet(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const wallet = {
    name: strings[2],
    api_key: strings[3],
    api_secret: strings[4]
  }
  const res = await coinService.addWalletFromBot(wallet)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function deleteWallet(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const wallet = {
    id: strings[2],
  }
  const res = await coinService.deleteWalletFromBot(wallet)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function updateWallet(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const wallet = {
    id: strings[2],
    name: strings[3],
    api_key: strings[4],
    api_secret: strings[5]
  }
  const res = await coinService.updateWalletFromBot(wallet)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function updateTime(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const res = jobService.updateTimeBalance(strings[2])
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function updateTimeMinute(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const res = jobService.updateTimeBalanceMinute(strings[2])
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function listWallet(ctx) {
  console.log('list')
  const chatId = ctx.message.chat.id
  const res = await coinService.listWalletFromBot()
  console.log('status', res.wallets)
  if (res.status) {
    let message = ''
    for (let i = 0; i < res.wallets.length || 0; i++) {
      console.log('111111111')
      message += "Id: " +  res.wallets[i]._id + '\n'
      message += "Name: " +  res.wallets[i].name + '\n'
      message += "Api key: " +  res.wallets[i].api_key + '\n'
      message += "Secret key: " +  res.wallets[i].api_secret + '\n'
      message += "Báo số dư: " +  res.wallets[i].status + '\n'
      message += "Báo biến động: " +  res.wallets[i].statusChange + '\n \n'
    }
    ctx.telegram.sendMessage(chatId, message)
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function report(ctx) {
  try {
    let totalAllWallet = 0
    const listWallet = await Wallet.find()
    for (let j = 0; j < listWallet.length; j++) {
      const binnaceObj = coinService.BinaceOption(listWallet[j])
      const totalBalance = await binnaceObj.getBalance(ctx)
      if (listWallet[j].status) {
        totalAllWallet += totalBalance['USDT']
      }
    }
    const chatId = ctx.message.chat.id
    ctx.telegram.sendMessage(chatId,`Total All Wallet: ${totalAllWallet}`)
  } catch (e) {
    console.log(e)
  }
}

async function addChat(ctx) {
  const chatId = ctx.message.chat.id
  try {
    const strings = ctx.message.text.split('/')
    const chat = {
      chatId: strings[2],
    }
    const response = await Chat({
      chatId: strings[2],
    }).save()
    if (response._id) {
      ctx.telegram.sendMessage(chatId, 'Thành công')
    } else {
      ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
    }
  } catch (e) {
    console.log(e)
    ctx.telegram.sendMessage(chatId, 'Thất bại: ')
  }
}

async function updateChat(ctx) {
  const chatId = ctx.message.chat.id
  try {
    const strings = ctx.message.text.split('/')
    const chatNew = {
      chatId: strings[3]
    }
    Chat.findOneAndUpdate({_id: strings[2]}, chatNew, function (err, docs) { 
      if (err){ 
        console.log(err) 
        ctx.telegram.sendMessage(chatId, 'Thất bại: ')
      }
      ctx.telegram.sendMessage(chatId, 'Thành công')
    }); 
  } catch (e) {
    console.log(e)
    ctx.telegram.sendMessage(chatId, 'Thất bại: ')
  }
}

async function updateGuestChat(ctx, status) {
  const chatId = ctx.message.chat.id
  try {
    const strings = ctx.message.text.split('/')
    const chatNew = {
      isGuest: status
    }
    Chat.findOneAndUpdate({_id: strings[2]}, chatNew, function (err, docs) { 
      if (err){ 
        console.log(err) 
        ctx.telegram.sendMessage(chatId, 'Thất bại: ')
      }
      ctx.telegram.sendMessage(chatId, 'Thành công')
    }); 
  } catch (e) {
    console.log(e)
    ctx.telegram.sendMessage(chatId, 'Thất bại: ')
  }
}

async function deleteChat(ctx) {
  const chatId = ctx.message.chat.id
  try {
    const strings = ctx.message.text.split('/')
    Chat.findOneAndDelete({_id: strings[2]} , function (err, docs) { 
      if (err){ 
        console.log(err) 
        ctx.telegram.sendMessage(chatId, 'Thất bại: ')
      }
      ctx.telegram.sendMessage(chatId, 'Thành công')
    }); 
  } catch (e) {
    console.log(e)
    ctx.telegram.sendMessage(chatId, 'Thất bại: ')
  }
}

async function listChat(ctx) {
  const chatId = ctx.message.chat.id
  const listChat = await Chat.find({})
  console.log(listChat)
  if (listChat && listChat.length > 0) {
    let message = ''
    for (let i = 0; i < listChat.length || 0; i++) {
      message += "Id: " +  listChat[i]._id + '\n'
      message += "chatId: " +  listChat[i].chatId + '\n'
      message += "isGuest: " +  listChat[i].isGuest + '\n' + '\n'
    }
    ctx.telegram.sendMessage(chatId, message)
  } else {
    ctx.telegram.sendMessage(chatId, 'Không có chat nào ')
  }
}

bot.launch()
