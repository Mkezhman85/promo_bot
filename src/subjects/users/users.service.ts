import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../infrastructure/config/config.service.interface';
import { TYPES } from '../../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { IUserService } from './interfaces/users.service.interface';
import { User } from './user.entity';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password, cityId }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name, cityId);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		// проверяем, что пользователь есть
		const existedUser = await this.usersRepository.find(email);
		// если есть - возвращаем null
		if (existedUser) {
			return null;
		}
		// если нет - создаём
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(
			existedUser.email,
			existedUser.name,
			existedUser.cityId,
			existedUser.password,
		);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}

	async getAllUsers(): Promise<UserModel[] | null> {
		return this.usersRepository.findAll();
	}

	async findUsersOnCities(cityId: number): Promise<UserModel[] | null> {
		return this.usersRepository.findUsersOnCities(cityId);
	}
}
