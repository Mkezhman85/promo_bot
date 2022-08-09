import { PrismaClient } from '@prisma/client';

const getData = async (): Promise<string[]> => {
	const prisma = new PrismaClient();
	const data = await prisma.promotion.findMany();
	const titles = [];
	for (let i = 0; i < data.length; i++) {
		titles.push(data[i].title);
	}
	let n = 1;
	for (let i = 0; i < titles.length; i++) {
		console.log(`${n}. ${titles[i]}`);
		n++;
	}
	await prisma.$disconnect();
	return titles;
};

export { getData };
