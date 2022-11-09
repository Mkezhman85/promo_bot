import 'dotenv/config';
import { Markup, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { IMyContext } from './interfaces/sessions.interface';
import { IBotService } from './interfaces/bot.service.interface';
import { ILogger } from '../infrastructure/logger/logger.interface';
import { TYPES } from '../types';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { commands } from './bot_command';
import { ICityService } from '../subjects/cities/interfaces/city.service.interface';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { IConfigService } from '../infrastructure/config/config.service.interface';
import { ITopicService } from '../subjects/topics/interfaces/topic.service.interface';
import { keyboard } from './bot_keyboard';
import { SceneGenerate } from './scene_generate';

@injectable()
export class BotService implements IBotService {
	bot: Telegraf<IMyContext>;

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.CityService) private cityService: ICityService,
		@inject(TYPES.TopicService) private topicService: ITopicService,
		@inject(TYPES.SceneGenerate) private sceneGenerate: SceneGenerate,
	) {
		this.bot = new Telegraf<IMyContext>(this.configService.get('TOKEN'));
	}

	init(): void {
		try {
			const stage = this.sceneGenerate.init();
			this.bot.use(new LocalSession({ database: 'session.json' }).middleware());
			this.bot.use(stage.middleware());

			this.bot.use((ctx, next) => {
				ctx.session.myProp;
				ctx.scene.session.myProps;
				next();
			});

			this.bot.start(async (ctx) => {
				await ctx.replyWithMarkdown(
					`Привет, ${
						ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'
					}! Для перехода к процессу выбора акций нажмите кнопку *Найти акции*`,
					Markup.inlineKeyboard([Markup.button.callback('🔍 Найти акции', 'begin')]),
				);
			});

			this.bot.hears('⏮ Выход', async (ctx) => {
				ctx.scene.leave();
				ctx.replyWithMarkdown('Осуществлен выход. Для начала работы введите команду */start*');
			});

			this.bot.action('begin', async (ctx) => {
				await ctx.scene.enter('getCityScene');
				await ctx.reply('🌆 Укажите город...', keyboard);
			});

			this.bot.action('citiesList', async (ctx) => {
				const allCities = await this.cityService.getAllCities();
				const citiesKeys: InlineKeyboardButton[][] = [];
				if (allCities?.length) {
					allCities.forEach((cityItem) => {
						citiesKeys.push([{ text: cityItem.name, callback_data: cityItem.name }]);
					});
					await ctx.reply(`Для выбора доступны города:`, {
						reply_markup: {
							inline_keyboard: citiesKeys,
						},
					});
					await ctx.scene.enter('getCityScene');
				} else {
					ctx.reply('Отсутствуют города...', keyboard);
				}
			});

			this.bot.action('topicList', async (ctx) => {
				const allTopics = await this.topicService.getAllTopics();
				const topiсKeys: InlineKeyboardButton[][] = [];
				if (allTopics?.length) {
					allTopics.forEach((topicItem) => {
						topiсKeys.push([{ text: topicItem.title, callback_data: topicItem.title }]);
					});
					ctx.reply(`🛍 Укажите одну из тематик:`, {
						reply_markup: {
							inline_keyboard: topiсKeys,
						},
					});
					ctx.scene.enter('getPromotionsScene');
				} else {
					ctx.reply('Отсутствуют тематики...', keyboard);
				}
			});

			this.bot.action('back', (ctx) => {
				ctx.scene.leave();
				ctx.replyWithMarkdown('Осуществлен выход. Для начала работы введите команду */start*');
			});

			this.bot.help((ctx) => ctx.reply(commands));
			this.bot.launch();

			// Enable graceful stop
			process.once('SIGINT', () => this.bot.stop('SIGINT'));
			process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
			this.loggerService.log(`[BotService] Бот ${this.bot.botInfo} успешно запущен...`);
		} catch (err) {
			if (err instanceof Error) {
				this.loggerService.error('[BotService] Ошибка подключения бота: ', err.message);
			}
		}
	}
}
