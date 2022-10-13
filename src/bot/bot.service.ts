import 'dotenv/config';
import { Markup, Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { IMyContext } from './sessions.interface';
import { IBotService } from './bot.service.interface';
const { leave, enter } = Scenes.Stage;
import { ILogger } from '../infrastructure/logger/logger.interface';
import { TYPES } from '../types';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { commands } from './bot_command';
import { ICityService } from '../subjects/cities/interfaces/city.service.interface';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { IConfigService } from '../infrastructure/config/config.service.interface';
import { IUserService } from '../subjects/users/interfaces/users.service.interface';
import { ITopicService } from '../subjects/topics/interfaces/topic.service.interface';
import { IPromotionService } from '../subjects/promotions/interfaces/promotion.service.interface';

@injectable()
export class BotService implements IBotService {
	bot: Telegraf;

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.CityService) private cityService: ICityService,
		@inject(TYPES.TopicService) private topicService: ITopicService,
		@inject(TYPES.PromotionService) private promotionService: IPromotionService,
	) {
		this.bot = new Telegraf(this.configService.get('TOKEN'));
	}

	init(): void {
		try {
			const token = this.configService.get('TOKEN');
			const getCityScene = new Scenes.BaseScene<IMyContext>('getCityScene');
			const getTopicScene = new Scenes.BaseScene<IMyContext>('getTopicScene');
			const getPromotionsScene = new Scenes.BaseScene<IMyContext>('getPromotionsScene');
			const stage = new Scenes.Stage<IMyContext>();
			stage.register(getCityScene, getTopicScene, getPromotionsScene);
			const bot = new Telegraf<IMyContext>(token);
			bot.use(new LocalSession({ database: 'session.json' }).middleware());
			bot.use(stage.middleware());
			bot.use((ctx, next) => {
				ctx.session.myProp;
				ctx.scene.session.myProps;
				next();
			});

			let city: string;
			let topic: string;

			bot.start(async (ctx) => {
				await ctx.replyWithMarkdown(
					`Привет, ${
						ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'
					}! Для перехода к процессу выбора акций нажмите кнопку *Найти акции*`,
					Markup.inlineKeyboard([Markup.button.callback('🔍 Найти акции', 'begin')]),
				);
			});

			bot.hears('⏮ Выход', async (ctx) => {
				ctx.scene.leave();
				ctx.replyWithMarkdown('Осуществлен выход. Для начала работы введите команду */start*');
			});

			bot.action('begin', async (ctx) => {
				await ctx.scene.enter('getCityScene');
				await ctx.reply(
					'🌆 Укажите город...',
					Markup.inlineKeyboard([
						Markup.button.callback('⏮ Выход', 'back'),
						Markup.button.callback('🌆 Список городов', 'citiesList'),
						Markup.button.callback('🛍 Список тематик', 'topicList'),
					]),
				);
			});

			bot.action('citiesList', async (ctx) => {
				const allCities = await this.cityService.getAllCities();
				const citiesKeys: InlineKeyboardButton[][] = [];
				if (allCities?.length) {
					allCities.forEach((c) => {
						citiesKeys.push([{ text: c.name, callback_data: c.name }]);
					});
					await ctx.reply(`Для выбора доступны города:`, {
						reply_markup: {
							inline_keyboard: citiesKeys,
						},
					});
					await ctx.scene.enter('getCityScene');
				} else {
					ctx.reply(
						'Отсутствуют города...',
						Markup.inlineKeyboard([
							Markup.button.callback('🔍 Найти акции', 'begin'),
							Markup.button.callback('⏮ Выход', 'back'),
						]),
					);
				}
			});

			bot.action('topicList', async (ctx) => {
				const allTopics = await this.topicService.getAllTopics();
				const topiсKeys: InlineKeyboardButton[][] = [];
				if (allTopics?.length) {
					allTopics.forEach((t) => {
						topiсKeys.push([{ text: t.title, callback_data: t.title }]);
					});
					ctx.reply(`🛍 Укажите одну из тематик:`, {
						reply_markup: {
							inline_keyboard: topiсKeys,
						},
					});
					ctx.scene.enter('getPromotionsScene');
				} else {
					ctx.reply(
						'Отсутствуют тематики...',
						Markup.inlineKeyboard([
							Markup.button.callback('🔍 Найти акции', 'begin'),
							Markup.button.callback('⏮ Выход', 'back'),
						]),
					);
				}
			});

			bot.action('back', (ctx) => {
				ctx.scene.leave();
				ctx.replyWithMarkdown('Осуществлен выход. Для начала работы введите команду */start*');
			});

			getCityScene.on('text', async (ctx) => {
				city = ctx.message.text;
				const existedCity = await this.cityService.getCityInfo(city);
				console.log(existedCity);
				await ctx.reply(`🌆 Вы указали город ${city}`);
				if (existedCity) {
					ctx.scene.leave();
					ctx.scene.enter('getTopicScene');
				} else {
					await ctx.reply(
						`😔 К сожалению город ${city} не найден... Попробуйте еще раз указать наименование города...`,
						Markup.inlineKeyboard([Markup.button.callback('⏮ Выход', 'back')]),
					);
					ctx.scene.reenter();
				}
			});

			getTopicScene.enter(async (ctx) => {
				const allTopics = await this.topicService.getAllTopics();
				const topiсKeys: InlineKeyboardButton[][] = [];
				if (allTopics?.length) {
					allTopics.forEach((t) => {
						topiсKeys.push([{ text: t.title, callback_data: t.title }]);
					});
					ctx.reply(`🛍 Укажите одну из тематик:`, {
						reply_markup: {
							inline_keyboard: topiсKeys,
						},
					});
					ctx.reply(
						'Для выхода нажмите кнопку...',
						Markup.inlineKeyboard([Markup.button.callback('⏮ Выход', 'back')]),
					);
					ctx.scene.enter('getPromotionsScene');
				} else {
					ctx.reply(
						'Отсутствуют тематики...',
						Markup.inlineKeyboard([
							Markup.button.callback('🔍 Найти акции', 'begin'),
							Markup.button.callback('⏮ Выход', 'back'),
						]),
					);
				}
			});

			getPromotionsScene.on('text', async (ctx) => {
				topic = ctx.message.text;
				const existedTopic = await this.topicService.getTopicInfo(topic);
				if (existedTopic) {
					const promotions = await this.promotionService.findPromotions(city, topic);
					const promotionsKeys: InlineKeyboardButton[][] = [];
					if (promotions?.length) {
						promotions.forEach((p) => {
							promotionsKeys.push([{ text: p.title, callback_data: p.title }]);
						});
						await ctx.reply(`В городе ${city} доступны следующие акции по тематике "${topic}":`, {
							reply_markup: {
								inline_keyboard: promotionsKeys,
							},
						});
						await ctx.reply(
							'ℹ️ Для перехода к поиску акций нажмите кнопку...',
							Markup.inlineKeyboard([
								Markup.button.callback('🔍 Найти акции', 'begin'),
								Markup.button.callback('⏮ Выход', 'back'),
							]),
						);
					} else {
						ctx.reply(
							`В городе ${city} по тематике "${topic}" нет доступных акций...`,
							Markup.inlineKeyboard([
								Markup.button.callback('🔍 Найти акции', 'begin'),
								Markup.button.callback('⏮ Выход', 'back'),
							]),
						);
						ctx.scene.leave();
					}
				} else {
					ctx.reply(
						`Сожалеем, но тематика "${topic}" не найдена...`,
						Markup.inlineKeyboard([
							Markup.button.callback('🔍 Найти акции', 'begin'),
							Markup.button.callback('⏮ Выход', 'back'),
						]),
					);
					ctx.reply('Попробуйте еще раз указать тематику...');
					ctx.scene.reenter();
				}
				ctx.scene.leave();
			});

			bot.help((ctx) => ctx.reply(commands));

			bot.launch();

			// Enable graceful stop
			process.once('SIGINT', () => bot.stop('SIGINT'));
			process.once('SIGTERM', () => bot.stop('SIGTERM'));
			this.loggerService.log(`[BotService] Бот ${bot.botInfo} успешно запущен...`);
		} catch (err) {
			if (err instanceof Error) {
				this.loggerService.error('[BotService] Ошибка подключения бота: ', err.message);
			}
		}
	}
}
