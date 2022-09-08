import { BaseController } from '../../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { HTTPError } from '../../errors/http-error.class';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './users.service';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../../config/config.service.interface';
import { AuthGuard } from '../../common/auth.guard';
import { UserModel } from '@prisma/client';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middleWares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middleWares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middleWares: [new AuthGuard()],
			},
			{
				path: '/getusers',
				method: 'get',
				func: this.getAllUsers,
				middleWares: [],
			},
			{
				path: '/getusersbycityid',
				method: 'get',
				func: this.findUsersOnCities,
				middleWares: [],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
		this.loggerService.log(`[UserService] Авторизация пользователя ${jwt}`);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.loggerService.log(`Регистрация пользователя. Email: ${body.email}`);
		this.ok(res, { email: result.email, id: result.id, name: result.name });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
		this.loggerService.log(
			`[UserService] Получена информация о пользователе: ${userInfo?.id}: ${userInfo?.email}`,
		);
	}

	async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
		const allUsers = await this.userService.getAllUsers();
		this.ok(res, allUsers);
		this.loggerService.log(`[UserService] Получен перечень пользователей...`);
	}

	async findUsersOnCities({ cityId }: Request, res: Response, next: NextFunction): Promise<void> {
		const userOnCities = await this.userService.findUsersOnCities(cityId);
		this.ok(res, userOnCities);
		this.loggerService.log(`[UserService] Получен перечень пользователей по городу...`);
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
