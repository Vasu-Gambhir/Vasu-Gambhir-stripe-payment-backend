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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller_1 = require("../controllers/controller");
const authenticate_1 = require("../middleware/authenticate");
router.get('/', (req, res) => {
    res.send('gooood');
});
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registeredUser = yield (0, controller_1.registerUser)(req, res);
        res.send(registeredUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = yield (0, controller_1.loginUser)(req, res);
        res.send(loggedInUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
router.get("/logout", authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedOutUser = yield (0, controller_1.logoutUser)(req, res);
        res.status(201).json(loggedOutUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
router.get("/get-all-transactions", authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdSession = yield (0, controller_1.getAllTransactions)(req, res);
        res.status(201).json(createdSession);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
router.post("/create-checkout-session", authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdSession = yield (0, controller_1.createCheckoutSession)(req, res);
        res.status(201).json(createdSession);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
router.get("/validuser", authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validUser = yield (0, controller_1.getValidUser)(req, res);
        res.send(validUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
exports.default = router;
