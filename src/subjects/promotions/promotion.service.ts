import { PromotionModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { PromotionCreateDto } from './dto/promotion-create.dto';
import { Promotion } from './promotion.entity';
import { IPromotionRepository } from './promotion.repository.interface';

@injectable()
export class PromotionService {
	constructor(
		@inject(TYPES.PromotionRepository) private promotionRepository: IPromotionRepository,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {}
	async createPromotion({
		title,
		text,
		themeId,
		cityId,
	}: PromotionCreateDto): Promise<PromotionModel | null> {
		const newPromotion = new Promotion(title, text, cityId, themeId);
		const existedPromotion = await this.promotionRepository.find(title);
		if (existedPromotion) {
			return null;
		}
		this.loggerService.log(`[PromotionService] Добавлена акция. ${title}`);
		return this.promotionRepository.createPromotion(newPromotion);
	}

	async getAllPromotions(): Promise<PromotionModel[] | null> {
		this.loggerService.log(`[PromotionService] Получен перечень акций...`);
		return this.promotionRepository.findAll();
	}

	async findPromotions(cityName: string, topicName: string): Promise<PromotionModel[] | null> {
		const findPromotions = await this.promotionRepository.findPromotions(cityName, topicName);
		if (findPromotions?.length) {
			this.loggerService.log(
				`[PromotionService] Получен перечень акций в городе ${cityName}, по тематике ${topicName}...`,
			);
		} else {
			this.loggerService.log(
				`[PromotionService] В городе ${cityName} по тематике ${topicName} нет доступных акций...`,
			);
		}
		return findPromotions;
	}
}
