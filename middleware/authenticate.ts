import USER from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";
const secretKey: Secret = process.env.KEY || "";

interface CustomRequest extends Request {
  token?: string;
  rootUser?: Document;
  userID?: string;
}

export const authenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.StripeProject;
    if (!token) {
      throw new Error("No token provided");
    }

    const verifytoken = jwt.verify(token, secretKey) as JwtPayload;
    if (
      !verifytoken ||
      typeof verifytoken !== "object" ||
      !("_id" in verifytoken)
    ) {
      throw new Error("Invalid token payload");
    }

    const rootUser = await USER.findOne({
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
  } catch (error: any) {
    res.status(401).send("Unauthorised : No token provided");
    console.log("from authenticate.js", error.message);
  }
};
