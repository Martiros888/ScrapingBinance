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
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    arr = [...arr, { id: msg.chat.id }];
    bot.sendMessage(msg.chat.id, "Բարև ձեզ խնդրում ենք մուտքագրել կոդը", options);
});
bot.on('text', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
        return;
    }
    const condition = chatId === +process.env.ADMIN_ID;
    const user = arr.find(elem => elem.id === msg.chat.id);
    if (!user.password) {
        const isTrue = yield bcrypt_1.default.compare(msg.text, process.env.PASSWORD);
        if (isTrue) {
            arr = arr.map(elem => {
                elem.password = msg.text;
                return elem;
            });
            bot.sendMessage(chatId, 'ճիշտ է');
            return;
        }
        bot.sendMessage(chatId, 'գրեք նորից');
        return;
    }
    if (msg.text === 'փոխել նվազելու արժեքը') {
        status = 'went';
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել թիվ նվազելու արժեքը փոփոխելու համար');
        return;
    }
    if (msg.text === 'փոխել աճելու արժեքը') {
        status = 'row';
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել թիվ աճելու արժեքը փոփոխելու համար');
        return;
    }
    if (isNaN(+msg.text)) {
        bot.sendMessage(process.env.ADMIN_ID, 'խնդրում ենք թիվ մուտքագրել');
        return;
    }
    if (status === 'row') {
        row = +msg.text;
        bot.sendMessage(process.env.ADMIN_ID, 'դուք փոխեցիք աճի տարբերությունը');
        return;
    }
    went = +msg.text;
    bot.sendMessage(process.env.ADMIN_ID, 'դուք փոխեցիք նվազման տարբերությունը');
}));
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map(elem => elem === "," ? "" : elem).join("");
    if (value >= bitcoin + row) {
        console.log(`row with ${row}`);
        bitcoin = value;
        arr.forEach(elem => elem.password ? bot.sendMessage(elem.id, `Բիթքոինի գինը աճել է $${row} և կազմում է $${bitcoin}`) : null);
    }
    if (value <= bitcoin - went) {
        console.log(`went down with ${went}`);
        bitcoin = value;
        arr.forEach(elem => elem.password ? bot.sendMessage(elem.id, `Բիթքոինի գինը նվազել է $${went} և կազմում է $${bitcoin}`) : null);
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