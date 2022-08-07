import { Telegraf } from 'telegraf';

const token = process.env.TOKEN;

if (!token) {
	throw new Error('Не задан токен');
}

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
	ctx.reply('Привет! Я бот акционных предложений!');
});

const createBot = async (): Promise<void> => {
	await bot.launch();
};

export { createBot };
