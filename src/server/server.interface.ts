import { Express } from 'express';
export interface IServerService {
	serverExpress: Express;
	port: number;
	init(): void;
}
