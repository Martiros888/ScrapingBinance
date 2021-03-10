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
let arr = [488557779, 999205555];
let status = 'row';
let row = 10;
let went = 10;
let bitcoin = 49000;
let difference = 100;
const bot = new node_telegram_bot_api_1.default(process.env.TOKEN, { polling: true });
// const optionс:TelegramBot.SendMessageOptions = {
//     parse_mode:
// }
bot.onText(/^\/start$/, msg => {
    const options = {
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: [
                [{ text: "Yes" }],
                [{ text: "No" }]
            ]
        }
    };
    // @ts-ignore
    bot.sendMessage(msg.chat.id, 'Բարև ձեզ դուք այս էջի ադմինն \n եք եթե զանկանում եք փոփոխել գինը խնդրում ենք օգտագործել ներքևի հրամանները և մուտքագրել թվեր ամեն հրամանը սեղմելուց հետո', options);
});
bot.on('text', (msg) => {
    if (msg.text === '/start' || msg.text === '/help') {
        return;
    }
    const chatId = msg.chat.id;
    console.log(chatId);
    const condition = chatId === +process.env.ADMIN_ID;
    if (!condition) {
        bot.sendMessage(chatId, 'Խնդրում ենք հեռանալ սա ձեր համար չէ');
        return;
    }
    if (isNaN(+msg.text)) {
        bot.sendMessage(process.env.ADMIN_ID, 'խնդրում ենք թիվ մուտքագրել');
        return;
    }
    difference = +msg.text;
    bot.sendMessage(process.env.ADMIN_ID, 'դուք փոխեցիք տարբերությունը');
});
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map(elem => elem === "," ? "" : elem).join("");
    if (value >= bitcoin + difference) {
        console.log(`row with ${difference}`);
        bitcoin = value;
        arr.forEach(elem => {
            bot.sendMessage(elem, `Բիթքոինի գինը աճել է $${difference} և կազմում է $${bitcoin}`);
        });
    }
    if (value <= bitcoin - difference) {
        console.log(`went down with ${difference}`);
        bitcoin = value;
        arr.forEach(elem => {
            bot.sendMessage(elem, `Բիթքոինի գինը նվազել է $${difference} և կազմում է $${bitcoin}`);
        });
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