import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { ILogger } from '../../infrastructure/logger/logger.interface';
import { TYPES } from '../../types';
import { Request, Response, NextFunction } from 'express';
import { ICityController } from './interfaces/city.controller.interface';
import { ICityService } from './interfaces/city.service.interface';
import { CityCreateDto } from './dto/city-add.dto';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { HTTPError } from '../../infrastructure/errors/http-error.class';

@injectable()
export class CityController extends BaseController implements ICityController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CityService) private cityService: ICityService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/createcity',
				method: 'post',
				func: this.createCity,
				middleWares: [new ValidateMiddleware(CityCreateDto)],
			},
			{
				path: '/allcities',
				method: 'get',
				func: this.getAllCities,
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
			},
		]);
	}

	async getAllCities(req: Request, res: Response, next: NextFunction): Promise<void> {
		const allCities = await this.cityService.getAllCities();
		this.ok(res, allCities);
		this.loggerService.log(`[CityService] Получен перечень городов...`);
	}

	async createCity(
		{ body }: Request<{}, {}, CityCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.cityService.createCity(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой город уже существует'));
		}
		this.ok(res, { name: result.name });
		this.loggerService.log(`[CityService] Добавлен город. ${result.name}`);
	}

	async info({ name }: Request, res: Response, next: NextFunction): Promise<void> {
		const cityInfo = await this.cityService.getCityInfo(name);
		this.ok(res, { name: cityInfo?.name, id: cityInfo?.id });
		this.loggerService.log(
			`[UserService] Получена информация о городе: ${cityInfo?.id}: ${cityInfo?.name}`,
		);
	}
}
