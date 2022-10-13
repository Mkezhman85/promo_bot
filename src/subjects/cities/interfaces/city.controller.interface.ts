import { Request, Response, NextFunction } from 'express';

export interface ICityController {
	createCity: (req: Request, res: Response, next: NextFunction) => void;
	getAllCities: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
