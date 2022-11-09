import { inject, injectable } from 'inversify';
import { Markup, Scenes } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ICityService } from '../../subjects/cities/interfaces/city.service.interface';
import { IPromotionService } from '../../subjects/promotions/interfaces/promotion.service.interface';
import { ITopicService } from '../../subjects/topics/interfaces/topic.service.interface';
import { TYPES } from '../../types';
import { keyboard } from '../bot_keyboard';
import { IMyContext } from '../interfaces/sessions.interface';
import { IScene } from '../interfaces/scene.interface';

@injectable()
export class GetPromotionsScene implements IScene {
	constructor(
		@inject(TYPES.CityService) private cityService: ICityService,
		@inject(TYPES.TopicService) private topicService: ITopicService,
		@inject(TYPES.PromotionService) private promotionService: IPromotionService,
	) {}
	init(): Scenes.BaseScene<IMyContext> {
		const getPromotionsScene = new Scenes.BaseScene<IMyContext>('getPromotionsScene');
		let topic: string;
		let city: string;
		getPromotionsScene.on('text', async (ctx) => {
			topic = ctx.message.text;
			const existedTopic = await this.topicService.getTopicInfo(topic);
			if (existedTopic) {
				const promotions = await this.promotionService.findPromotions(city, topic);
				const promotionsKeys: InlineKeyboardButton[][] = [];
				if (promotions?.length) {
					promotions.forEach((promotionItem) => {
						promotionsKeys.push([
							{ text: promotionItem.title, callback_data: promotionItem.title },
						]);
					});
					await ctx.reply(`В городе ${city} доступны следующие акции по тематике "${topic}":`, {
						reply_markup: {
							inline_keyboard: promotionsKeys,
						},
					});
					await ctx.reply('ℹ️ Для перехода к поиску акций нажмите кнопку...', keyboard);
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
				ctx.reply(`Сожалеем, но тематика "${topic}" не найдена...`, keyboard);
				ctx.reply('Попробуйте еще раз указать тематику...');
				ctx.scene.reenter();
			}
			ctx.scene.leave();
		});

		return getPromotionsScene;
	}
}
