"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.createBot = void 0;
const client_1 = require("@prisma/client");
const telegraf_1 = require("telegraf");
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const data = yield prisma.promotion.findMany();
    const titles = [];
    for (let i = 0; i < data.length; i++) {
        titles.push(data[i].title);
    }
    let n = 1;
    for (let i = 0; i < titles.length; i++) {
        console.log(`${n}. ${titles[i]}`);
        n++;
    }
    yield prisma.$disconnect();
    return titles;
});
exports.getData = getData;
const token = process.env.TOKEN;
if (!token) {
    throw new Error('Не задан токен');
}
const bot = new telegraf_1.Telegraf(token);
bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply('Привет! Я бот акционных предложений!');
}));
const createBot = () => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.launch();
});
exports.createBot = createBot;
