import 'dotenv/config';
import { ILogger } from './logger/logger.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { PrismaService } from './database/prisma.service';
import { IConfigService } from './config/config.service.interface';
import { IBotService } from './bot/bot.service.interface';
import { IServerService } from './server/server.interface';

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
