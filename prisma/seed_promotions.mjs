import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const perm = {
	name: 'Пермь',
};

const moscow = {
	name: 'Москва',
};

const voleyTopic = {
	title: 'Волейбол',
	description: 'Товары для волейболистов',
};

const footballTopic = {
	title: 'Футбол',
	description: 'Товары для футболистов и любителей футбола',
};

const fishTopic = {
	title: 'Рыбалка',
	description: 'Все для рыбалки',
};

const voleyPromotions = [
	{
		title: '5% кэшбэк на обувь',
		text: 'Возвращается 5% кэшбэк на товары из категории обувь',
	},
	{
		title: 'Купи 2 пары обуви',
		text: 'Купи 2 пары обуви и получи третью пару в подарок',
	},
	{
		title: 'Купи мячи и не кричи',
		text: 'При покупке 2 мячей насос в подарок',
	},
];

const footballPromotions = [
	{
		title: 'Скидка 10% на бутсы',
		text: 'Бутсы со скидкой',
	},
	{
		title: 'Приятности по промокоду',
		text: 'По промокоду купи 2 пары обуви и получи третью пару в подарок',
	},
	{
		title: 'Закупись мячами впрок',
		text: 'При покупке 2 мячей умение играть в футбол бонусом!!!',
	},
];

const fishPromotions = [
	{
		title: 'Кэшбэк при покупке удочек',
		text: 'Возвращается 5% кэшбэк на покупку удочек',
	},
	{
		title: 'Купи 2 крючка',
		text: 'Купи 2 крючка и получи третий в подарок',
	},
	{
		title: 'Ледорубы со скидкой',
		text: 'Бомбическая скидка на ледорубы',
	},
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
	await prisma.$connect();
	const createdVoleyTopic = await prisma.themeModel.create({ data: voleyTopic });
	const createdFishTopic = await prisma.themeModel.create({ data: fishTopic });
	const createdFootballTopic = await prisma.themeModel.create({ data: footballTopic });
	const createdPermCity = await prisma.cityModel.create({ data: perm });
	const createdMoscowCity = await prisma.cityModel.create({ data: moscow });
	await prisma.promotionModel.createMany({
		data: voleyPromotions.map((p) => ({
			...p,
			cityId: createdPermCity.id,
			themeId: createdVoleyTopic.id,
		})),
	});
	await prisma.promotionModel.createMany({
		data: fishPromotions.map((f) => ({
			...f,
			cityId: createdPermCity.id,
			themeId: createdFishTopic.id,
		})),
	});
	await prisma.promotionModel.createMany({
		data: footballPromotions.map((f) => ({
			...f,
			cityId: createdMoscowCity.id,
			themeId: createdFootballTopic.id,
		})),
	});
	await prisma.$disconnect();
}

main();
