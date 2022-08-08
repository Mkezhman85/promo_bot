import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createBot } from './bot';
import { getData } from '../services/test.service';

const prisma = new PrismaClient();

class App {
	async init(): Promise<void> {
		await prisma.$connect();
		await getData();
		await createBot();
	}
}

const app = new App();
app.init();
