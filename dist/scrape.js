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
exports.runscript = exports.router = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
let difference = 10;
let bitcoin = 49000;
const getData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.evaluate(() => {
        let element = document.getElementsByClassName("css-10nf7hq");
        return element[53].innerHTML;
    });
    let value = +result.slice(1).split("").map((elem) => (elem === "," ? "" : elem)).join("");
    if (value >= bitcoin + difference) {
        console.log(`row with ${difference}`);
        bitcoin = value;
        const payload = {
            data: {
                message: "row",
                bitcoin: String(bitcoin),
            }
        };
        // admin.messaging().sendToDevice(process.env.registrToken,payload).then(res=>console.log(res)).catch(err=>console.log(err))
    }
    if (value <= bitcoin - difference) {
        console.log(`went down with ${difference}`);
        bitcoin = value;
        const payload = {
            data: {
                message: "went",
                bitcoin: String(bitcoin),
            }
        };
        // admin.messaging().sendToDevice(process.env.registrToken,payload).then(res=>console.log(res)).catch(err=>console.log(err))
    }
    console.log(value, bitcoin);
});
exports.runscript = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.goto(process.env.API);
    function run1() {
        let num = 0;
        let a = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            num++;
            if (num > 5) {
                clearInterval(a);
                getData(page);
                run2();
            }
        }), 1000);
    }
    function run2() {
        let num = 0;
        let a = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            num++;
            if (num > 5) {
                clearInterval(a);
                getData(page);
                run1();
            }
        }), 1000);
    }
    run1();
});
exports.router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value } = req.body;
        difference = value;
        console.log(difference);
        res.send({ value: bitcoin });
    }
    catch (err) {
        console.log(err);
    }
}));
//# sourceMappingURL=scrape.js.map