import { NextFunction, Request, Response, Router } from 'express';
import { Middleware } from 'telegraf';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
	middleWares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
