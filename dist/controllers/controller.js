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
exports.getValidUser = exports.createCheckoutSession = exports.getAllTransactions = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const stripe_1 = __importDefault(require("stripe"));
const stripeInstance = new stripe_1.default(process.env.STRIPEAPIKEY || "");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, mobile, password, cpassword } = req.body;
    if (!name || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "Fill all the Fields" });
    }
    try {
        const preUser = yield userModel_1.default.findOne({ email: email });
        if (preUser) {
            res.status(422).json({ error: "Email is already registered" });
        }
        else if (password !== cpassword) {
            res.status(422).json({ error: "Password doest not match" });
        }
        else {
            const finalUser = new userModel_1.default({
                name,
                email,
                mobile,
                password,
                cpassword,
            });
            //password hashing process
            const userData = yield finalUser.save();
            res.status(201).json(userData);
        }
    }
    catch (error) {
        console.log("error", error.message);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Fill all the Fields" });
    }
    try {
        const userLogin = yield userModel_1.default.findOne({ email: email });
        if (!userLogin) {
            return res.status(400).json({ message: `No account found for ${email}` });
        }
        else {
            const isMatch = yield bcryptjs_1.default.compare(password, userLogin.password);
            if (!isMatch) {
                res.status(400).json({ message: "Incorrect Password" });
            }
            else {
                //token generate
                const token = yield userLogin.generateAuthtoken();
                res.cookie("StripeProject", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(201).json({ userLogin });
            }
        }
    }
    catch (error) {
        console.log("error: Invalid Details" + error.message);
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (req.rootUser) {
            req.rootUser.tokens =
                ((_a = req.rootUser) === null || _a === void 0 ? void 0 : _a.tokens.filter((currele) => {
                    return currele.token !== req.token;
                })) || [];
        }
        res.clearCookie("StripeProject", { path: "/" });
        yield ((_b = req.rootUser) === null || _b === void 0 ? void 0 : _b.save());
        return req === null || req === void 0 ? void 0 : req.rootUser;
        // res.status(201).json(req.rootUser);
    }
    catch (error) {
        console.log("error for user log out");
    }
});
exports.logoutUser = logoutUser;
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const successfulTransactions = yield stripeInstance.charges.list({
            limit: 100,
        });
        const unSuccessfulTransactions = yield stripeInstance.balanceTransactions.list({ limit: 100 });
        const successfulData = successfulTransactions.data;
        // const unSuccessfulData = unSuccessfulTransactions.data;
        // const allTransactions = [...successfulData, ...unSuccessfulData];
        return successfulData;
        // res.send( allTransactions);
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllTransactions = getAllTransactions;
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const session = yield stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: req.body.inputs.productName,
                    },
                    unit_amount: req.body.inputs.amount, // in cents
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.NODE_ENV === "production" ? "https://stripe-payment-frontend-psi.vercel.app?success" : "http://localhost:3000?success"}`,
        cancel_url: `${process.env.NODE_ENV === "production" ? "https://stripe-payment-frontend-psi.vercel.app?failed" : "http://localhost:3000?failed"}`,
    });
    return session;
    //   res.json({session });
});
exports.createCheckoutSession = createCheckoutSession;
const getValidUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userLogin = yield userModel_1.default.findOne({ _id: req.userID });
        res.status(201).json({ userLogin });
    }
    catch (error) {
        console.log("error in cartdetails API", error);
    }
});
exports.getValidUser = getValidUser;
