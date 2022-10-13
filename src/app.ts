import 'dotenv/config';
import 'reflect-metadata';
import { ILogger } from './infrastructure/logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IBotService } from './bot/bot.service.interface';
import { IServerService } from './server/server.interface';
import { IConfigService } from './infrastructure/config/config.service.interface';
import { PrismaService } from './infrastructure/database/prisma.service';

@injectable()
export class App {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.BotService) private bot: IBotService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ServerService) private serverService: IServerService,
	) {}

	public async init(): Promise<void> {
		await this.serverService.init();
		await this.bot.init();
	}
}
