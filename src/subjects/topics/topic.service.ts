import { ThemeModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../infrastructure/logger/logger.interface';
import { TYPES } from '../../types';
import { TopicCreateDto } from './dto/topic-add.dto';
import { ITopicRepository } from './interfaces/topic.repository.interface';
import { Theme } from './topic.entity';

@injectable()
export class TopicService {
	constructor(
		@inject(TYPES.TopicRepository) private topicRepository: ITopicRepository,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {}
	async createTheme({ title, description }: TopicCreateDto): Promise<ThemeModel | null> {
		const newTheme = new Theme(title, description);
		const existedTheme = await this.topicRepository.find(title);
		if (existedTheme) {
			return null;
		}
		this.loggerService.log(`[ThemeService] Добавлена тематика ${title}`);
		return this.topicRepository.createTheme(newTheme);
	}

	async getAllTopics(): Promise<ThemeModel[] | null> {
		this.loggerService.log(`[ThemeService] Получен перечень тематик...`);
		return this.topicRepository.findAll();
	}

	async getTopicInfo(title: string): Promise<ThemeModel | null> {
		const existedTopic = await this.topicRepository.find(title);
		if (existedTopic) {
			this.loggerService.log(
				`[ThemeService] Получена информация по тематике "${existedTopic.title}"...`,
			);
		} else {
			this.loggerService.log(`[ThemeService] Тематика не найдена...`);
		}
		return existedTopic;
	}
}
