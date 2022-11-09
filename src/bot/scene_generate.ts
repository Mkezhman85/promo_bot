import { Scenes } from 'telegraf';
import { IMyContext } from './interfaces/sessions.interface';
import { GetCityScene } from './scenes/getCityScene';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { GetTopicScene } from './scenes/getTopicScene';
import { GetPromotionsScene } from './scenes/getPromotionsScene';

@injectable()
export class SceneGenerate {
	constructor(
		@inject(TYPES.GetCityScene) private getCityScene: GetCityScene,
		@inject(TYPES.GetTopicScene) private getTopicScene: GetTopicScene,
		@inject(TYPES.GetPromotionsScene) private getPromotionsScene: GetPromotionsScene,
	) {}
	init(): Scenes.Stage<IMyContext, Scenes.SceneSessionData> {
		const getCityScene = this.getCityScene.init();
		const getTopicScene = this.getTopicScene.init();
		const getPromotionsScene = this.getPromotionsScene.init();
		const stage = new Scenes.Stage<IMyContext>([getCityScene, getTopicScene, getPromotionsScene]);
		return stage;
	}
}
