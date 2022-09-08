import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { TYPES } from '../../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name, cityId }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
				cityId,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}

	async findAll(): Promise<UserModel[] | null> {
		return this.prismaService.client.userModel.findMany();
	}

	async findUsersOnCities(cityId: number): Promise<UserModel[] | null> {
		return this.prismaService.client.userModel.findMany({
			where: {
				cityId,
			},
		});
	}
}
