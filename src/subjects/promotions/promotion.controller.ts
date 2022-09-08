import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../../errors/http-error.class';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { IPromotionController } from './promotion.controller.interface';
import { IPromotionService } from './promotion.service.interface';
import { PromotionCreateDto } from './dto/promotion-create.dto';

@injectable()
export class PromotionController extends BaseController implements IPromotionController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.PromotionService) private promotionService: IPromotionService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/createpromotion',
				method: 'post',
				func: this.createPromotion,
				middleWares: [new ValidateMiddleware(PromotionCreateDto)],
			},
			{
				path: '/allpromotions',
				method: 'get',
				func: this.getAllPromotions,
			},
		]);
	}

	async getAllPromotions(req: Request, res: Response, next: NextFunction): Promise<void> {
		const allPromotions = await this.promotionService.getAllPromotions();
		this.ok(res, allPromotions);
		this.loggerService.log(`[PromotionService] Получен перечень городов...`);
	}

	async createPromotion(
		{ body }: Request<{}, {}, PromotionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.promotionService.createPromotion(body);
		if (!result) {
			return next(new HTTPError(422, 'Такая акция уже существует'));
		}
		this.ok(res, { title: result.title });
		this.loggerService.log(`[PromotionService] Добавлена акция. ${result.title}`);
	}
}
