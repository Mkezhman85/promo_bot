import { UserModel } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
	getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	findUsersOnCities: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
