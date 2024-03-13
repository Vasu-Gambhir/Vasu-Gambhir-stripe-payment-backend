"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DB = process.env.DATABASE;
if (!DB) {
    console.error("Environment variable DATABASE is not defined.");
    process.exit(1); // Exit the process if DATABASE is not defined
}
mongoose_1.default
    .connect(DB)
    .then(() => console.log("Database connected Successfully"))
    .catch((error) => console.error("Error:", error.message));
