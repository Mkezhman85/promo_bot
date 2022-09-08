import { PromotionModel } from '@prisma/client';
import { PromotionCreateDto } from './dto/promotion-create.dto';

export interface IPromotionService {
	createPromotion: (dto: PromotionCreateDto) => Promise<PromotionModel | null>;
	getAllPromotions: () => Promise<PromotionModel[] | null>;
	findPromotions: (cityName: string, topicName: string) => Promise<PromotionModel[] | null>;
}
