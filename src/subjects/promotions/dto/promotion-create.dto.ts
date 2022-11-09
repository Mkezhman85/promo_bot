import { IsNumber, IsString } from 'class-validator';

export class PromotionCreateDto {
	@IsString({ message: 'Не указано наименование акции' })
	title!: string;

	@IsString({ message: 'Не указано описание акции' })
	text!: string;

	@IsNumber()
	themeId!: number;

	@IsNumber()
	cityId!: number;
}
