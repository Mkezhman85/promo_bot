import { CityModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { TYPES } from '../../types';
import { City } from './city.entity';
import { ICityRepository } from './city.repository.interface';

@injectable()
export class CityRepository implements ICityRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async createCity({ name }: City): Promise<CityModel> {
		return this.prismaService.client.cityModel.create({
			data: {
				name,
			},
		});
	}

	async find(name: string): Promise<CityModel | null> {
		return this.prismaService.client.cityModel.findFirst({
			where: {
				name,
			},
		});
	}

	async findAll(): Promise<CityModel[] | null> {
		return this.prismaService.client.cityModel.findMany();
	}
}
