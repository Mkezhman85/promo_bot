import { IsArray, IsEmail, IsNumber, IsString } from 'class-validator';
import { Promotion } from '../../promotions/promotion.entity';

export class TopicCreateDto {
	@IsString({ message: 'Не указано наименование тематики' })
	title!: string;

	@IsString({ message: 'Не указано наименование тематики' })
	description!: string;
}
