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
exports.runscript = void 0;
require('dotenv').config();
const puppeteer_1 = __importDefault(require("puppeteer"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
let bitcoin = 60000;
let arr = [];
const bot = new node_telegram_bot_api_1.default(process.env.TOKEN, { polling: true });
const options = {
    parse_mode: "MarkdownV2",
    reply_markup: {
        keyboard: [
            [{ text: `փոխել նվազելու արժեքը` }],
            [{ text: `փոխել աճելու արժեքը` }]
        ]
    }
};
bot.setMyCommands([{ command: 'start', description: 'start' }]);
bot.onText(/^\/start$/, msg => {
    const chatId = msg.chat.id;
    const user = arr.find(elem => elem.id === chatId);
    if (user) {
        bot.sendMessage(chatId, 'Դուք արդեն գրանցված եք');
        return;
    }
    arr = [...arr, { id: chatId, bitcoin, row: 0, went: 0 }];
    bot.sendMessage(chatId, "Բարև ձեզ խնդրում ենք մուտքագրել կոդը", options);
});
bot.on('text', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
        return;
    }
    const user = arr.find(elem => elem.id === chatId);
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
        arr = arr.map(elem => {
            if (elem.id === chatId) {
                elem.status = 'went';
            }
            return elem;
        });
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել թիվ նվազելու արժեքը փոփոխելու համար')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (msg.text === 'փոխել աճելու արժեքը') {
        arr = arr.map(elem => {
            if (elem.id === chatId) {
                elem.status = 'row';
            }
            return elem;
        });
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել թիվ աճելու արժեքը փոփոխելու համար')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (isNaN(+msg.text)) {
        bot.sendMessage(chatId, 'խնդրում ենք թիվ մուտքագրել')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        return;
    }
    if (!user.status) {
        bot.sendMessage(chatId, 'դուք չեք նշել ինչն եք ուզում փոխել')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
    }
    if (user.status === 'row') {
        bot.sendMessage(chatId, 'դուք փոխեցիք աճի տարբերությունը')
            .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
        arr = arr.map(elem => {
            if (elem.id === chatId) {
                elem.row = +msg.text;
            }
            return elem;
        });
        return;
    }
    bot.sendMessage(chatId, 'դուք փոխեցիք նվազման տարբերությունը')
        .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== chatId));
    arr = arr.map(elem => {
        if (elem.id === chatId) {
            elem.went = +msg.text;
        }
        return elem;
    });
}));
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = ~~+result.slice(1).split("").map(elem => elem === "," ? "" : elem).join("");
    arr.map(user => {
        bitcoin = value;
        console.log(value);
        if (user.password) {
            if (value >= user.bitcoin + user.row) {
                bot.sendMessage(user.id, `Բիթքոինի գինը աճել է $${~~(value - user.bitcoin)} և կազմում է $${value}`)
                    .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== user.id));
                user.bitcoin = value;
                return user;
            }
            if (value <= user.bitcoin - user.went) {
                bot.sendMessage(user.id, `Բիթքոինի գինը նվազել է $${~~(user.bitcoin - value)} և կազմում է $${value}`)
                    .then(res => null).catch(err => arr = arr.filter(elem => elem.id !== user.id));
                user.bitcoin = value;
                return user;
            }
        }
        return user;
    });
});
const runscript = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process',
        ]
    });
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
exports.runscript = runscript;
//# sourceMappingURL=scrape.js.map