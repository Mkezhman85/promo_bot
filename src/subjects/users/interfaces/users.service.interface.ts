import { UserModel } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
	getAllUsers: () => Promise<UserModel[] | null>;
	findUsersOnCities: (cityId: number) => Promise<UserModel[] | null>;
}
