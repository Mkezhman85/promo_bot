import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IServerService } from './server.interface';
import { Server } from 'http';
import { UserController } from '../subjects/users/user.controller';
import { IExeptionFilter } from '../errors/exeption.filter.interface';
import { json } from 'body-parser';
import { AuthMiddleware } from '../common/auth.middleware';
import { IConfigService } from '../config/config.service.interface';
import { PrismaService } from '../database/prisma.service';
import { CityController } from '../subjects/cities/city.controller';
import { PromotionController } from '../subjects/promotions/promotion.controller';
import { TopicController } from '../subjects/topics/topic.controller';

@injectable()
export class ServerService implements IServerService {
	serverExpress: Express;
	server!: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.CityController) private cityController: CityController,
		@inject(TYPES.PromotionController) private promotionController: PromotionController,
		@inject(TYPES.TopicController) private topicController: TopicController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.serverExpress = express();
		this.port = 8000;
	}

	useMiddleWare(): void {
		this.serverExpress.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.serverExpress.use(authMiddleware.execute.bind(authMiddleware));
	}

	userRoutes(): void {
		this.serverExpress.use('/users', this.userController.router);
		this.serverExpress.use('/cities', this.cityController.router);
		this.serverExpress.use('/promotions', this.promotionController.router);
		this.serverExpress.use('/topics', this.topicController.router);
	}

	useExeptionFilters(): void {
		this.serverExpress.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	init(): void {
		try {
			this.useMiddleWare();
			this.userRoutes();
			this.useExeptionFilters();
			this.prismaService.connect();
			this.server = this.serverExpress.listen(this.port);
			this.loggerService.log(`[ServerService] Сервер запущен на http://localhost:${this.port}`);
		} catch (err) {
			if (err instanceof Error) {
				this.loggerService.error('[ServerService] Ошибка сервера: ', err.message);
			}
		}
	}
}
