import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { BotService } from './bot/bot.service';
import { IBootstrapReturn } from './common/interfaces/bootstrapreturn.interface';
import { ILogger } from './infrastructure/logger/logger.interface';
import { LoggerService } from './infrastructure/logger/logger.service';
import { ServerService } from './server/server.service';
import { CityController } from './subjects/cities/city.controller';
import { ICityController } from './subjects/cities/interfaces/city.controller.interface';
import { CityRepository } from './subjects/cities/city.repository';
import { CityService } from './subjects/cities/city.service';
import { ICityService } from './subjects/cities/interfaces/city.service.interface';
import { PromotionController } from './subjects/promotions/promotion.controller';
import { IPromotionController } from './subjects/promotions/interfaces/promotion.controller.interface';
import { PromotionRepository } from './subjects/promotions/promotion.repository';
import { PromotionService } from './subjects/promotions/promotion.service';
import { TopicController } from './subjects/topics/topic.controller';
import { ITopicController } from './subjects/topics/interfaces/topic.controller.interface';
import { TopicRepository } from './subjects/topics/topic.repository';
import { TopicService } from './subjects/topics/topic.service';
import { UsersRepository } from './subjects/users/users.repository';
import { UserService } from './subjects/users/users.service';
import { TYPES } from './types';
import { UserController } from './subjects/users/user.controller';
import { IUserService } from './subjects/users/interfaces/users.service.interface';
import { IUsersRepository } from './subjects/users/interfaces/users.repository.interface';
import { ICityRepository } from './subjects/cities/interfaces/city.repository.interface';
import { IPromotionService } from './subjects/promotions/interfaces/promotion.service.interface';
import { IPromotionRepository } from './subjects/promotions/interfaces/promotion.repository.interface';
import { ITopicService } from './subjects/topics/interfaces/topic.service.interface';
import { ITopicRepository } from './subjects/topics/interfaces/topic.repository.interface';
import { IConfigService } from './infrastructure/config/config.service.interface';
import { PrismaService } from './infrastructure/database/prisma.service';
import { ExeptionFilter } from './infrastructure/errors/exeption.filter';
import { ConfigService } from './infrastructure/config/config.service';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<BotService>(TYPES.BotService).to(BotService);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<ServerService>(TYPES.ServerService).to(ServerService).inSingletonScope();
	bind<ExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<ICityController>(TYPES.CityController).to(CityController).inSingletonScope();
	bind<ICityService>(TYPES.CityService).to(CityService).inSingletonScope();
	bind<ICityRepository>(TYPES.CityRepository).to(CityRepository).inSingletonScope();
	bind<IPromotionController>(TYPES.PromotionController).to(PromotionController).inSingletonScope();
	bind<IPromotionService>(TYPES.PromotionService).to(PromotionService).inSingletonScope();
	bind<IPromotionRepository>(TYPES.PromotionRepository).to(PromotionRepository).inSingletonScope();
	bind<ITopicController>(TYPES.TopicController).to(TopicController).inSingletonScope();
	bind<ITopicService>(TYPES.TopicService).to(TopicService).inSingletonScope();
	bind<ITopicRepository>(TYPES.TopicRepository).to(TopicRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
