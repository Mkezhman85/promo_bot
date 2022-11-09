import { inject, injectable } from 'inversify';
import { Markup, Scenes } from 'telegraf';
import { ICityService } from '../../subjects/cities/interfaces/city.service.interface';
import { TYPES } from '../../types';
import { IMyContext } from '../interfaces/sessions.interface';
import { IScene } from '../interfaces/scene.interface';

@injectable()
export class GetCityScene implements IScene {
	constructor(@inject(TYPES.CityService) private cityService: ICityService) {}
	init(): Scenes.BaseScene<IMyContext> {
		const getCityScene = new Scenes.BaseScene<IMyContext>('getCityScene');
		let city: string;
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
		return getCityScene;
	}
}
