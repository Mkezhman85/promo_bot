import { Telegraf } from 'telegraf';
import { IMyContext } from './sessions.interface';

export interface IBotService {
	bot: Telegraf<IMyContext>;
	init: () => void;
}
