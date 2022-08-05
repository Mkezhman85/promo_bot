"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBot = void 0;
const telegraf_1 = require("telegraf");
/**
 * Считываем токен
 */
const token = process.env.TOKEN;
/**
 * Проверяем на условие "Если не задан токен"
 */
if (!token) {
    throw new Error('Не задан токен');
}
const bot = new telegraf_1.Telegraf(token);
bot.command('start', (ctx) => {
    ctx.reply('Привет! Я бот акционных предложений!');
});
const createBot = () => {
    bot.launch();
};
exports.createBot = createBot;
