import { IsEmail, IsString } from 'class-validator';

export class CityCreateDto {
	@IsString({ message: 'Не указано наименование города' })
	name!: string;
}
