import { ThemeModel } from '@prisma/client';
import { Theme } from './topic.entity';

export interface ITopicRepository {
	createTheme: (theme: Theme) => Promise<ThemeModel>;
	find: (title: string) => Promise<ThemeModel | null>;
	findAll: () => Promise<ThemeModel[] | null>;
}
