// Needed to avoid anoying alert from node telegram bot api package. https://github.com/yagop/node-telegram-bot-api/issues/319
process.env.NTBA_FIX_319 = true;

const TelegramBot = require('node-telegram-bot-api');

const { TELEGRAM_BOT_TOKEN, CHANNEL_ID } = process.env;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

bot.publish = message => bot.sendMessage(CHANNEL_ID, message);

module.exports = bot;
