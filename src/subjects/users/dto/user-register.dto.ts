import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email!: string;

	@IsString({ message: 'Не указан пароль' })
	password!: string;

	@IsString({ message: 'Не указано имя' })
	name!: string;

	@IsNumber()
	cityId!: number;
}
