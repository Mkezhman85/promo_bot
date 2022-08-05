import { Telegraf } from 'telegraf';

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

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
	ctx.reply('Привет! Я бот акционных предложений!');
});

const createBot = (): void => {
	bot.launch();
};

export { createBot };
