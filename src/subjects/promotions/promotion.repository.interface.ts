import { PromotionModel } from '@prisma/client';
import { Promotion } from './promotion.entity';

export interface IPromotionRepository {
	createPromotion: (promotion: Promotion) => Promise<PromotionModel>;
	find: (email: string) => Promise<PromotionModel | null>;
	findAll: () => Promise<PromotionModel[] | null>;
	findPromotions: (cityName: string, topicName: string) => Promise<PromotionModel[] | null>;
}
