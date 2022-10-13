import { Request, Response, NextFunction } from 'express';

export interface ITopicController {
	createTheme: (req: Request, res: Response, next: NextFunction) => void;
	getAllTopics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
