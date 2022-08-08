/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const theme = {
	title: 'Бытовая техника',
	description: 'Данная тематика включает в себя акционные предложения по бытовой технике',
};

const themes = [
	{
		title: 'Бытовая техника',
		description: 'Данная тематика включает в себя акционные предложения по бытовой технике',
	},
	{
		title: 'Спорттовары',
		description: 'Спорттовары',
	},
	{
		title: 'Бытовая химия',
		description: 'Бытовая химия',
	},
	{
		title: 'Товары для животных',
		description: 'Товары для животных',
	},
	{
		title: 'Кофе',
		description: 'Все для кофе',
	},
];

const cities = [
	{ name: 'Москва' },
	{ name: 'Санкт-Петербург' },
	{ name: 'Сочи' },
	{ name: 'Воронеж' },
	{ name: 'Екатеринбург' },
	{ name: 'Нижний Новгород' },
	{ name: 'Уфа' },
	{ name: 'Казань' },
];

const promotions = [
	{
		title: 'Сертификат дополнительного обслуживания в подарок',
		image: '',
		text: 'Каждому покупателю, сумма покупки которого превысила 5000 рублей сертификат дополнительного обслуживания в подарок',
	},
	{
		title: 'Скидка на наушники',
		image: '',
		text: 'Каждому покупателю, купившему наушники скидка 10% от чека',
	},
];

const tags = [
	{
		name: 'Бытовая техника',
	},
	{
		name: 'Прочие товары',
	},
	{
		name: 'Спорт',
	},
	{
		name: 'Зоотовары',
	},
];

async function main() {
	await prisma.$connect();
	const createTheme = await prisma.theme.create({ data: theme });

	await prisma.theme.createMany({
		data: themes.map((t) => ({ ...t })),
	});

	await prisma.tag.createMany({
		data: tags.map((t) => ({ ...t })),
	});

	await prisma.city.createMany({
		data: cities.map((c) => ({ ...c })),
	});

	await prisma.promotion.createMany({
		data: promotions.map((p) => ({ ...p, themeId: createTheme.id })),
	});
	await prisma.$disconnect();
}

main();
