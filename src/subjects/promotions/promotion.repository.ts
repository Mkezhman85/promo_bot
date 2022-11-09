import { PromotionModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TYPES } from '../../types';
import { ICityService } from '../cities/interfaces/city.service.interface';
import { ITopicService } from '../topics/interfaces/topic.service.interface';
import { IPromotionRepository } from './interfaces/promotion.repository.interface';
import { Promotion } from './promotion.entity';

@injectable()
export class PromotionRepository implements IPromotionRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.CityService) private cityService: ICityService,
		@inject(TYPES.TopicService) private topicService: ITopicService,
	) {}
	async createPromotion({ title, text, themeId, cityId }: Promotion): Promise<PromotionModel> {
		return this.prismaService.client.promotionModel.create({
			data: {
				title,
				text,
				themeId,
				cityId,
			},
		});
	}

	async find(title: string): Promise<PromotionModel | null> {
		return this.prismaService.client.promotionModel.findFirst({
			where: {
				title,
			},
		});
	}

	async findAll(): Promise<PromotionModel[] | null> {
		return this.prismaService.client.promotionModel.findMany();
	}

	async findPromotions(cityName: string, topicName: string): Promise<PromotionModel[] | null> {
		const findCity = await this.cityService.getCityInfo(cityName);
		const findTopic = await this.topicService.getTopicInfo(topicName);
		return this.prismaService.client.promotionModel.findMany({
			where: {
				cityId: findCity?.id,
				themeId: findTopic?.id,
			},
		});
	}
}
