import { Markup } from 'telegraf';

export const keyboard = Markup.inlineKeyboard([
	Markup.button.callback('🌆 Список городов', 'citiesList'),
	Markup.button.callback('🛍 Список тематик', 'topicList'),
	Markup.button.callback('🔍 Найти акции', 'begin'),
	Markup.button.callback('⏮ Выход', 'back'),
]);
