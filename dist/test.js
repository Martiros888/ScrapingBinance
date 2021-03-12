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
const ccxt_1 = __importDefault(require("ccxt"));
const axios_1 = __importDefault(require("axios"));
const tick = (config, binanceClient) => __awaiter(void 0, void 0, void 0, function* () {
    const { asset, base, spread, allocation } = config;
    const market = `${asset}/${base}`;
    const orders = yield binanceClient.fetchOpenOrders(market);
    orders.forEach((order) => __awaiter(void 0, void 0, void 0, function* () {
        yield binanceClient.cancelOrder(order.id);
        console.log(order);
    }));
    const results = yield Promise.all([
        axios_1.default.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    ]);
    const market2 = results[0].data.bitcoin.usd;
    console.log(market2);
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const { API_KEY, SECRET_KEY } = process.env;
    const binance = new ccxt_1.default.binance({ apiKey: API_KEY, secret: SECRET_KEY });
    const config = {
        asset: 'BTC',
        base: "USDT",
        allocation: 0.1,
        spread: 0.2,
        tickInterval: 2000,
    };
    tick(config, binance);
    // setInterval(tick,config.tickInterval,config,binance)
});
run();
//# sourceMappingURL=test.js.map