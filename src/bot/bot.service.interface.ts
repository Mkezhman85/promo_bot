import { Telegraf } from 'telegraf';

export interface IBotService {
	bot: Telegraf;
	init: () => void;
}
