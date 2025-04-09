const coinService = require('../services/coin-service')
const walletService = require('../services/wallet-service')
const jobService = require('../services/job-service.js')
const { Telegraf, Markup } = require('telegraf')
const config = require('../config/config.js')
const PATH = require('path')
const bot = new Telegraf(config.BOT_TOKEN_SERVICE)
const {message } = require('telegraf/filters')
const { Wallet } = require('../models/wallet')
const { Chat } = require('../models/chat')
const botLoggerService = require('./bot-logger-service');

bot.start( async (ctx) => {
  backToMenu(ctx)
})

bot.action('wallet_cb', async (ctx) => {
  await ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Add", callback_data: "wallet_add_cb"}, {text: "Update", callback_data: "wallet_update_cb"}],
          [{text: "Delete", callback_data: "wallet_delete_cb"}, {text: "List", callback_data: "wallet_list_cb"}],
          [{text: "Report now", callback_data: "report_now_cb"}, {text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('back_to_wallet_menu_cb', async (ctx) => {
  backToWalletMenu(ctx)
})

bot.action('report_now_cb',  async (ctx) => {
  try {
    report(ctx)
  } catch (e) {
    console.log(e)
  }
})


bot.action('wallet_add_cb',  async (ctx) => {
  try {
    ctx.telegram.sendMessage(ctx.chat.id, 'Add wallet: \n wallet/add/{Name}/{api_key}/{secret_key} \n', 
      {
        reply_markup: {
          inline_keyboard: [
            [{text: "Back", callback_data: "back_to_wallet_menu_cb"}]
          ]
        }
      }
    )
  } catch (e) {
    console.log(e)
  }
})

bot.action('wallet_update_cb',  async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Update wallet: \n wallet/update/{id}/{name}/{api key}/{secret_key} \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_wallet_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('wallet_delete_cb',  async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Delete wallet: \n wallet/delete/{id} \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_wallet_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('wallet_list_cb',  async (ctx) => {
  listWallet(ctx)
})



bot.action('time_cb', async (ctx) => {
  await ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option time report', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Hour", callback_data: "time_hour_cb"}, {text: "Minute", callback_data: "time_minute_cb"}],
          [{text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('back_to_time_menu_cb', async (ctx) => {
  backToTimeMenu(ctx)
})

bot.action('time_minute_cb', async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Update time minute wallet: \n time/minute/{thời gian} \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_time_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('time_hour_cb', async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Update time hour wallet: \n time/hour/{thời gian} \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_time_menu_cb"}]
        ]
      }
    }
  )
})



bot.action('balance_change_cb', async (ctx) => {
  await ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option balance change', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Enable", callback_data: "balance_change_enable_cb"}, {text: "Disable", callback_data: "balance_change_disable_cb"}],
          [{text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('back_to_balance_change_menu_cb', async (ctx) => {
  backToTimeMenu(ctx)
})

bot.action('balance_change_enable_cb', async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Enable balance change: \n {id}/balanceChange/enable \n', 
  {
    reply_markup: {
      inline_keyboard: [
        [{text: "Back", callback_data: "back_to_balance_change_menu_cb"}]
      ]
    }
  }
)
})

bot.action('balance_change_disable_cb', async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Disable balance change wallet: \n {id}/balanceChange/disable \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_balance_change_menu_cb"}]
        ]
      }
    }
  )
})


bot.action('balance_report_cb', async (ctx) => {
  await ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option balance report', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Enable", callback_data: "balance_report_enable_cb"}, {text: "Disable", callback_data: "balance_report_disable_cb"}],
          [{text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('back_to_balance_report_menu_cb', async (ctx) => {
  backToTimeMenu(ctx)
})

bot.action('balance_report_enable_cb', async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Enable balance report: \n {id}/balance/enable \n', 
  {
    reply_markup: {
      inline_keyboard: [
        [{text: "Back", callback_data: "back_to_balance_report_menu_cb"}]
      ]
    }
  }
)
})

bot.action('balance_report_disable_cb', async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Disable balance report: \n {id}/balance/disable \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_balance_report_menu_cb"}]
        ]
      }
    }
  )
})

//wallet trx
bot.action('wallet_trx_cb', async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Add", callback_data: "wallet_trx_add_cb"}, {text: "Update", callback_data: "wallet_trx_update_cb"}],
          [{text: "Delete", callback_data: "wallet_trx_delete_cb"}, {text: "List", callback_data: "wallet_trx_list_cb"}],
          [{text: "Report now", callback_data: "wallet_trx_report_now_cb"}, {text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('wallet_trx_add_cb',  async (ctx) => {
  try {
    ctx.telegram.sendMessage(ctx.chat.id, 'Add wallet: \n wallet_trx/add/{Name}/{address} \n', 
      {
        reply_markup: {
          inline_keyboard: [
            [{text: "Back", callback_data: "back_to_wallet_trx_menu_cb"}]
          ]
        }
      }
    )
  } catch (e) {
    console.log(e)
  }
})

bot.action('wallet_trx_update_cb',  async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Update wallet: \n wallet_trx/update/{id}/{name}/{address} \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_wallet_trx_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('wallet_trx_delete_cb',  async (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Delete wallet: \n wallet_trx/delete/{id} \n', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back", callback_data: "back_to_wallet_trx_menu_cb"}]
        ]
      }
    }
  )
})

bot.action('wallet_trx_report_now_cb',  async (ctx) => {
  try {
    reportWalletTrx(ctx)
  } catch (e) {
    console.log(e)
  }
})

bot.action('wallet_trx_list_cb',  async (ctx) => {
  listWalletTrx(ctx)
})


bot.action('back_to_wallet_trx_menu_cb', async (ctx) => {
  backToWalletTrxMenu(ctx)
})

function backToWalletTrxMenu(ctx) {
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Add", callback_data: "wallet_trx_add_cb"}, {text: "Update", callback_data: "wallet_trx_update_cb"}],
          [{text: "Delete", callback_data: "wallet_trx_delete_cb"}, {text: "List", callback_data: "wallet_trx_list_cb"}],
          [{text: "Report now", callback_data: "wallet_trx_report_now_cb"}, {text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
}

bot.action('back_to_main_menu_cb', async (ctx) => {
  await ctx.deleteMessage()
  backToMenu(ctx)
})

function backToMenu(ctx) {
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Wallet", callback_data: "wallet_cb"}, {text: "Time", callback_data: "time_cb"}],
          [{text: "Balance change", callback_data: "balance_change_cb"}, {text: "Balance report", callback_data: "balance_report_cb"}],
          [{text: "Wallet USDT-TRC20", callback_data: "wallet_trx_cb"}]
        ]
      }
    }
  )
}

function backToWalletMenu(ctx) {
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Add", callback_data: "wallet_add_cb"}, {text: "Update", callback_data: "wallet_update_cb"}],
          [{text: "Delete", callback_data: "wallet_delete_cb"}, {text: "List", callback_data: "wallet_list_cb"}],
          [{text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
}

function backToTimeMenu(ctx) {
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option time report', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Hour", callback_data: "time_hour_cb"}, {text: "Minute", callback_data: "time_minute_cb"}],
          [{text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
}

function backToBalanceChangeMenu(ctx) {
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option balance change', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Enable", callback_data: "balance_change_enable_cb"}, {text: "Disable", callback_data: "balance_change_disable_cb"}],
          [{text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
}

function backToBalanceReportMenu(ctx) {
  ctx.telegram.sendMessage(ctx.chat.id, 'Select option balance report', 
    {
      reply_markup: {
        inline_keyboard: [
          [{text: "Enable", callback_data: "balance_report_enable_cb"}, {text: "Disable", callback_data: "balance_report_disable_cb"}],
          [{text: "Back", callback_data: "back_to_main_menu_cb"}]
        ]
      }
    }
  )
}

bot.launch()

/* bot.on(message('text'), async (ctx) => {
  let value
  try {
    value = await redisClient.get(`${ctx.message.chat.id}`)
  } catch (e) {
    console.log(e)
  }
  try {
    if (value == 'add') {
      const res = await addWallet(ctx)
      if (res) {
        redisClient.del(`${ctx.message.chat.id}`)
        backToWalletMenu(ctx)
      } else {
        ctx.telegram.sendMessage(ctx.message.chat.id, 'Add wallet: \n {Name}/{api_key}/{secret_key} \n', 
          {
            reply_markup: {
              inline_keyboard: [
                [{text: "Back", callback_data: "back_to_wallet_menu_cb"}]
              ]
            }
          }
        )
      }
    }
  } catch (e) {
    console.log(e)
  }
})
 */

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
    } else if (ctx.message.text.match(/wallet_trx/)) {
      if (ctx.message.text.match(/add/)) {
        return addWalletTrx(ctx)
      } else if (ctx.message.text.match(/delete/)) {
        return deleteWalletTrx(ctx)
      } else if (ctx.message.text.match(/update/)) {
        return updateWalletTrx(ctx)
      }  else if (ctx.message.text.match(/list/)) {
        return listWalletTrx(ctx)
      } else {
        ctx.telegram.sendMessage(chatId, 'Định dạng không đúng')
        return
      }
    } else if (ctx.message.text.match(/wallet/)) {
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
    } else if (ctx.message.text.match(/time/)) {
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

bot.command('custom', async (ctx) => {
  return await ctx.reply('Custom buttons keyboard', Markup
    .keyboard([
      ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
      ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
      ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
  )
})

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
  return new Promise(async function(resolve, reject) {
    const chatId = ctx.message.chat.id
    const strings = ctx.message.text.split('/')
    const wallet = {
      name: strings[2],
      api_key: strings[3],
      api_secret: strings[4]
    }
    const res = await coinService.addWalletFromBot(wallet)
    if (res.status) {
      await ctx.telegram.sendMessage(chatId, 'Thành công')
      return resolve(true)
    } else {
      await ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
      return resolve(false)
    }
  })
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
  const chatId = ctx.chat.id
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
    if (message == '') message = 'Empty'
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
      const totalBalance = await binnaceObj.getBalance({message: {chat: {id: ctx.chat.id}}, telegram: ctx.telegram})
      if (listWallet[j].status) {
        totalAllWallet += totalBalance['USDT']
      }
    }
    const chatId = ctx.chat.id
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

async function addWalletTrx(ctx) {
  return new Promise(async function(resolve, reject) {
    const chatId = ctx.message.chat.id
    const strings = ctx.message.text.split('/')
    const wallet = {
      name: strings[2],
      address: strings[3],
    }
    const res = await walletService.addWalletFromBot(wallet)
    if (res.status) {
      await ctx.telegram.sendMessage(chatId, 'Thành công')
      return resolve(true)
    } else {
      await ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
      return resolve(false)
    }
  })
}

async function deleteWalletTrx(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const wallet = {
    id: strings[2],
  }
  const res = await walletService.deleteWalletFromBot(wallet)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function updateWalletTrx(ctx) {
  const chatId = ctx.message.chat.id
  const strings = ctx.message.text.split('/')
  const wallet = {
    id: strings[2],
    name: strings[3],
  }
  if (strings[4]) {
    wallet.address = strings[4]
  }
  const res = await walletService.updateWalletFromBot(wallet)
  if (res.status) {
    ctx.telegram.sendMessage(chatId, 'Thành công')
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function listWalletTrx(ctx) {
  console.log('list')
  const chatId = ctx.chat.id
  const res = await walletService.listWalletFromBot()
  console.log('status', res.wallets)
  if (res.status) {
    let message = ''
    for (let i = 0; i < res.wallets.length || 0; i++) {
      console.log('111111111')
      message += "Id: " +  res.wallets[i]._id + '\n'
      message += "Name: " +  res.wallets[i].name + '\n'
      message += "Address: " +  res.wallets[i].address + '\n'
      message += "Balance: " +  Math.floor(parseFloat(res.wallets[i].balance)) + '\n'
      message += "Báo số dư: " +  res.wallets[i].status + '\n'
      message += "Báo biến động: " +  res.wallets[i].statusChange + '\n \n'
    }
    if (message == '') message = 'Empty'
    ctx.telegram.sendMessage(chatId, message)
  } else {
    ctx.telegram.sendMessage(chatId, 'Thất bại: ' + res.message)
  }
}

async function reportWalletTrx(ctx) {
  try {
    let totalAllWallet = 0
    walletService.getBalanceUSDT_TRC20({message: {chat: {id: ctx.chat.id}}, telegram: ctx.telegram})
  } catch (e) {
    console.log(e)
  }
}

