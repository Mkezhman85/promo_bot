import { CityModel, ThemeModel } from '@prisma/client';
import { TopicCreateDto } from './dto/topic-add.dto';

export interface ITopicService {
	createTheme: (dto: TopicCreateDto) => Promise<ThemeModel | null>;
	getAllTopics: () => Promise<ThemeModel[] | null>;
	getTopicInfo: (title: string) => Promise<ThemeModel | null>;
}
