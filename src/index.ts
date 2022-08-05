import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createBot } from './bot';

const prisma = new PrismaClient();

class App {
	async init(): Promise<void> {
		await prisma.$connect();
		createBot();
	}
}

const app = new App();
app.init();
