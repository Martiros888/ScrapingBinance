"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const scrape_1 = require("./scrape");
const app = express_1.default();
const port = process.env.port;
app.use(cors_1.default());
app.use(morgan_1.default(`dev`));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: false
}));
scrape_1.runscript();
app.use('/changedifference', scrape_1.router);
app.get('/', (req, res) => {
    res.send('hello');
});
app.listen(port, () => console.log(`server is runnig on port http://localhost:${port}`));
//# sourceMappingURL=server.js.map