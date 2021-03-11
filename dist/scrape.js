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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const puppeteer_1 = __importDefault(require("puppeteer"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
let arr = [];
let status = 'row';
let row = 10;
let went = 10;
let bitcoin = 49000;
const bot = new node_telegram_bot_api_1.default(process.env.TOKEN, { polling: true });
bot.onText(/^\/start$/, msg => {
    const options = {
        parse_mode: "MarkdownV2",
        reply_markup: {
            keyboard: [
                [{ text: 'փոխել նվազելու արժեքը' }],
                [{ text: "փոխել աճելու արժեքը" }]
            ]
        }
    };
    const user = arr.find(elem => elem.id === msg.chat.id);
    if (user) {
        bot.sendMessage(msg.chat.id, 'Դուք արդեն գրանցված եք');
        return;
    }
    arr = [...arr, { id: msg.chat.id }];
    bot.sendMessage(msg.chat.id, "Բարև ձեզ խնդրում ենք մուտքագրել կոդը", options);
});
bot.on('text', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
        return;
    }
    const user = arr.find(elem => elem.id === msg.chat.id);
    if (!user) {
        bot.sendMessage(chatId, 'խնդրում ենք սեղմել /start սկսելու համար')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (!user.password) {
        if (msg.text === process.env.PASSWORD) {
            arr = arr.map(elem => {
                elem.password = msg.text;
                return elem;
            });
            bot.sendMessage(chatId, 'ճիշտ է')
                .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
            return;
        }
        bot.sendMessage(chatId, 'գրեք նորից')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (msg.text === 'փոխել նվազելու արժեքը') {
        status = 'went';
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել թիվ նվազելու արժեքը փոփոխելու համար')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (msg.text === 'փոխել աճելու արժեքը') {
        status = 'row';
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել թիվ աճելու արժեքը փոփոխելու համար')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (isNaN(+msg.text)) {
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (status === 'row') {
        bot.sendMessage(chatId, 'դուք փոխեցիք աճի տարբերությունը')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        row = +msg.text;
        return;
    }
    bot.sendMessage(chatId, 'դուք փոխեցիք նվազման տարբերությունը')
        .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
    went = +msg.text;
}));
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = ~~+result.slice(1).split("").map(elem => elem === "," ? "" : elem).join("");
    if (value >= bitcoin + row) {
        arr.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.password) {
                bot.sendMessage(user.id, `Բիթքոինի գինը աճել է $${~~(value - bitcoin)} և կազմում է $${value}`)
                    .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== user.id));
            }
        }));
        bitcoin = value;
    }
    if (value <= bitcoin - went) {
        arr.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.password) {
                bot.sendMessage(user.id, `Բիթքոինի գինը նվազել է $${~~(bitcoin - value)} և կազմում է $${value}`)
                    .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== user.id));
            }
        }));
        bitcoin = value;
    }
    console.log(value, bitcoin);
});
const runscript = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.goto(process.env.API);
    function run1() {
        let num = 0;
        let a = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            num++;
            if (num > 1) {
                clearInterval(a);
                getData(page);
                run2();
            }
        }), 5000);
    }
    function run2() {
        let num = 0;
        let a = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            num++;
            if (num > 1) {
                clearInterval(a);
                getData(page);
                run1();
            }
        }), 5000);
    }
    run1();
});
runscript();
//# sourceMappingURL=scrape.js.map