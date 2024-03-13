"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db/db");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const cors_1 = __importDefault(require("cors"));
const cookieParser = require("cookie-parser");
const routes_1 = __importDefault(require("./routes/routes"));
app.use(express_1.default.json());
app.use(cookieParser(""));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", ""],
    credentials: true,
    // exposedHeaders: ["set-cookie"],
}));
app.use(routes_1.default);
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
