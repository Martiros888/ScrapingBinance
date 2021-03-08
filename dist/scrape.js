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
exports.runscript = exports.bitcoin = exports.difference = void 0;
require('dotenv').config();
const puppeteer_1 = __importDefault(require("puppeteer"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
exports.difference = 10;
exports.bitcoin = 49000;
const bot = new node_telegram_bot_api_1.default(process.env.TOKEN, { polling: true });
bot.on('text', (msg, match) => {
    // if (msg.chat.id !== process.env.AMDIN_ID){
    // bot.sendMessage(msg.chat.id,'please go on it isnt for you')
    //}
    if (isNaN(+msg.text)) {
        bot.sendMessage(process.env.ADMIN_ID, 'please enter number');
        return;
    }
    exports.difference = +msg.text;
    bot.sendMessage(process.env.ADMIN_ID, 'ok you changed the difference');
});
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map(elem => elem === "," ? "" : elem).join("");
    if (value >= exports.bitcoin + exports.difference) {
        console.log(`row with ${exports.difference}`);
        exports.bitcoin = value;
        bot.sendMessage(process.env.ADMIN_ID, `Bitcoin Value was row and is ${exports.bitcoin}`);
    }
    if (value <= exports.bitcoin - exports.difference) {
        console.log(`went down with ${exports.difference}`);
        exports.bitcoin = value;
        bot.sendMessage(process.env.ADMIN_ID, `Bitcoin Value was went and is ${exports.bitcoin}`);
    }
    console.log(value, exports.bitcoin);
});
exports.runscript = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.runscript();
//# sourceMappingURL=scrape.js.map