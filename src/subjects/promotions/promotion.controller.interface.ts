import { Request, Response, NextFunction } from 'express';

export interface IPromotionController {
	createPromotion: (req: Request, res: Response, next: NextFunction) => void;
	getAllPromotions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
