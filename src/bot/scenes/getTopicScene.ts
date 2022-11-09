import { inject, injectable } from 'inversify';
import { Markup, Scenes } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ITopicService } from '../../subjects/topics/interfaces/topic.service.interface';
import { TYPES } from '../../types';
import { keyboard } from '../bot_keyboard';
import { IMyContext } from '../interfaces/sessions.interface';
import { IScene } from '../interfaces/scene.interface';

@injectable()
export class GetTopicScene implements IScene {
	constructor(@inject(TYPES.TopicService) private topicService: ITopicService) {}
	init(): Scenes.BaseScene<IMyContext> {
		const getTopicScene = new Scenes.BaseScene<IMyContext>('getTopicScene');
		getTopicScene.enter(async (ctx) => {
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
				ctx.reply(
					'Для выхода нажмите кнопку...',
					Markup.inlineKeyboard([Markup.button.callback('⏮ Выход', 'back')]),
				);
				ctx.scene.enter('getPromotionsScene');
			} else {
				ctx.reply('Отсутствуют тематики...', keyboard);
			}
		});

		return getTopicScene;
	}
}
