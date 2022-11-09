import { Scenes } from 'telegraf';
import { IMyContext } from './sessions.interface';

export interface IScene {
	init(): Scenes.BaseScene<IMyContext>;
}
