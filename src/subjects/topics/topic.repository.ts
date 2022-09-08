import { ThemeModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { TYPES } from '../../types';
import { Theme } from './topic.entity';
import { ITopicRepository } from './topic.repository.interface';

@injectable()
export class TopicRepository implements ITopicRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async createTheme({ title, description }: Theme): Promise<ThemeModel> {
		return this.prismaService.client.themeModel.create({
			data: {
				title,
				description,
			},
		});
	}

	async find(title: string): Promise<ThemeModel | null> {
		return this.prismaService.client.themeModel.findFirst({
			where: {
				title,
			},
		});
	}

	async findAll(): Promise<ThemeModel[] | null> {
		return this.prismaService.client.themeModel.findMany();
	}
}
