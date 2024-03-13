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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.KEY || "";
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        },
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});
//password hasshing
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcryptjs_1.default.hash(this.password, 12);
            this.cpassword = yield bcryptjs_1.default.hash(this.cpassword, 12);
        }
        next();
    });
});
//token generate
userSchema.methods.generateAuthtoken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let token = jsonwebtoken_1.default.sign({ _id: this._id }, secretKey);
            this.tokens = this.tokens.concat({ token: token });
            yield this.save();
            return token;
        }
        catch (error) {
            console.log(error.message);
        }
    });
};
const USER = mongoose_1.default.model("USER", userSchema);
exports.default = USER;
