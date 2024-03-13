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
exports.authenticate = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.KEY || "";
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.StripeProject;
        if (!token) {
            throw new Error("No token provided");
        }
        const verifytoken = jsonwebtoken_1.default.verify(token, secretKey);
        if (!verifytoken ||
            typeof verifytoken !== "object" ||
            !("_id" in verifytoken)) {
            throw new Error("Invalid token payload");
        }
        const rootUser = yield userModel_1.default.findOne({
            _id: verifytoken._id,
            "tokens.token": token,
        });
        if (!rootUser) {
            throw new Error("user not found");
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id.toString();
        next();
    }
    catch (error) {
        res.status(401).send("Unauthorised : No token provided");
        console.log("from authenticate.js", error.message);
    }
});
exports.authenticate = authenticate;
