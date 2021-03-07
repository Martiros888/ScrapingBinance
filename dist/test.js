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
const puppeteer_1 = __importDefault(require("puppeteer"));
require('dotenv').config();
let bitcoin = 49000;
const test = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    console.log(process.memoryUsage());
    let value = +result.slice(1).split("").map((elem) => (elem === "," ? "" : elem)).join("");
    if (value >= bitcoin + 10) {
        console.log("row with 10");
        bitcoin = value;
        const data = {
            message: "went",
            bitcoin,
        };
    }
    if (value <= bitcoin - 10) {
        console.log("went down with 10");
        bitcoin = value;
        const data = {
            message: "went",
            bitcoin,
        };
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
            if (num > 5) {
                console.log('run1');
                clearInterval(a);
                test(page);
                run2();
            }
        }), 2000);
    }
    function run2() {
        let num = 0;
        let a = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            num++;
            if (num > 5) {
                console.log('run2');
                clearInterval(a);
                test(page);
                run1();
            }
        }), 2000);
    }
    run1();
});
runscript();
//# sourceMappingURL=test.js.map