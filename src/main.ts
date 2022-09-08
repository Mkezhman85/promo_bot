import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { BotService } from './bot/bot.service';
import { IBootstrapReturn } from './common/bootstrapreturn.interface';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { ServerService } from './server/server.service';
import { CityController } from './subjects/cities/city.controller';
import { ICityController } from './subjects/cities/city.controller.interface';
import { CityRepository } from './subjects/cities/city.repository';
import { ICityRepository } from './subjects/cities/city.repository.interface';
import { CityService } from './subjects/cities/city.service';
import { ICityService } from './subjects/cities/city.service.interface';
import { PromotionController } from './subjects/promotions/promotion.controller';
import { IPromotionController } from './subjects/promotions/promotion.controller.interface';
import { PromotionRepository } from './subjects/promotions/promotion.repository';
import { IPromotionRepository } from './subjects/promotions/promotion.repository.interface';
import { PromotionService } from './subjects/promotions/promotion.service';
import { IPromotionService } from './subjects/promotions/promotion.service.interface';
import { TopicController } from './subjects/topics/topic.controller';
import { ITopicController } from './subjects/topics/topic.controller.interface';
import { TopicRepository } from './subjects/topics/topic.repository';
import { ITopicRepository } from './subjects/topics/topic.repository.interface';
import { TopicService } from './subjects/topics/topic.service';
import { ITopicService } from './subjects/topics/topic.service.interface';
import { UserController } from './subjects/users/user.controller';
import { UsersRepository } from './subjects/users/users.repository';
import { IUsersRepository } from './subjects/users/users.repository.interface';
import { UserService } from './subjects/users/users.service';
import { IUserService } from './subjects/users/users.service.interface';
import { TYPES } from './types';

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
