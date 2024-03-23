import USER, { UserDocument } from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import stripe from "stripe";
const stripeInstance = new stripe(process.env.STRIPEAPIKEY || "");

interface RequestWithUser extends Request {
  rootUser?: UserDocument;
  token?: string;
  userID?: string;
}

interface RequestBody {
  name: string;
  email: string;
  mobile: string;
  password: string;
  cpassword: string;
}

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, mobile, password, cpassword } = req.body as RequestBody;

  if (!name || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "Fill all the Fields" });
  }

  try {
    const preUser = await USER.findOne({ email: email });
    if (preUser) {
      res.status(422).json({ error: "Email is already registered" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "Password doest not match" });
    } else {
      const finalUser = new USER({
        name,
        email,
        mobile,
        password,
        cpassword,
      });
      //password hashing process
      const userData = await finalUser.save();
    res.status(201).json(userData);
    }
  } catch (error: any) {
    console.log("error", error.message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Fill all the Fields" });
  }
  try {
    const userLogin = await USER.findOne({ email: email });
    if (!userLogin) {
      return res.status(400).json({ message: `No account found for ${email}` });
    } else {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ message: "Incorrect Password" });
      } else {
        //token generate
        const token = await userLogin.generateAuthtoken();
        res.cookie("StripeProject", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.status(201).json({ userLogin });
      }
    }
  } catch (error: any) {
    console.log("error: Invalid Details" + error.message);
  }
};

export const logoutUser = async (req: RequestWithUser, res: Response) => {
  try {
    if (req.rootUser) {
      req.rootUser.tokens =
        req.rootUser?.tokens.filter((currele) => {
          return currele.token !== req.token;
        }) || [];
    }

    res.clearCookie("StripeProject", { path: "/" });

    await req.rootUser?.save();
    return req?.rootUser;
    // res.status(201).json(req.rootUser);
  } catch (error) {
    console.log("error for user log out");
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const successfulTransactions = await stripeInstance.charges.list({
      limit: 100,
    });
    const unSuccessfulTransactions =
      await stripeInstance.balanceTransactions.list({ limit: 100 });
    const successfulData = successfulTransactions.data;
    // const unSuccessfulData = unSuccessfulTransactions.data;
    // const allTransactions = [...successfulData, ...unSuccessfulData];
    return successfulData;
    // res.send( allTransactions);
  } catch (error) {
    console.error(error);
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  console.log(req.body)
  const session = await stripeInstance.checkout.sessions.create({
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
};


export const getValidUser = async (req: RequestWithUser, res: Response) => {
  try {
    const userLogin = await USER.findOne({ _id: req.userID });
    res.status(201).json({ userLogin });
  } catch (error) {
    console.log("error in cartdetails API", error);
  }
}