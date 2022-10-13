import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';
import { IExeptionFilter } from './exeption.filter.interface';
import { HTTPError } from './http-error.class';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {}
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.loggerService.error(`[${err.context}] Код: ${err.statusCode} Ошибка: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.loggerService.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
