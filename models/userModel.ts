import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
const secretKey: Secret = process.env.KEY || "";

export interface UserDocument extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  cpassword: string;
  tokens: { token: string }[];
  generateAuthtoken: () => Promise<string>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }

  next();
});

//token generate

userSchema.methods.generateAuthtoken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, secretKey);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error: any) {
    console.log(error.message);
  }
};

const USER = mongoose.model<UserDocument>("USER", userSchema);

export default USER;
