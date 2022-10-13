import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { ILogger } from '../../infrastructure/logger/logger.interface';
import { TYPES } from '../../types';
import { Request, Response, NextFunction } from 'express';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { TopicCreateDto } from './dto/topic-add.dto';
import { ITopicController } from './interfaces/topic.controller.interface';
import { ITopicService } from './interfaces/topic.service.interface';
import { HTTPError } from '../../infrastructure/errors/http-error.class';

@injectable()
export class TopicController extends BaseController implements ITopicController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.TopicService) private themeService: ITopicService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/createtopic',
				method: 'post',
				func: this.createTheme,
				middleWares: [new ValidateMiddleware(TopicCreateDto)],
			},
			{
				path: '/alltopics',
				method: 'get',
				func: this.getAllTopics,
			},
		]);
	}

	async getAllTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
		const allTopics = await this.themeService.getAllTopics();
		this.ok(res, allTopics);
		this.loggerService.log(`[TopicService] Получен перечень тематик...`);
	}

	async createTheme(
		{ body }: Request<{}, {}, TopicCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.themeService.createTheme(body);
		if (!result) {
			return next(new HTTPError(422, 'Такая тематика уже существует'));
		}
		this.ok(res, { name: result.title });
		this.loggerService.log(`[ThemeService] Добавлена тематика. ${result.title}`);
	}
}
