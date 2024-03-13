import express, { Request, Response } from "express";
const router = express.Router();
import {
  loginUser,
  logoutUser,
  registerUser,
  getAllTransactions,
  createCheckoutSession,
  getValidUser,
} from "../controllers/controller";
import { authenticate } from "../middleware/authenticate";

router.get('/', (req, res) => {
  res.send('gooood')
})


router.post("/register", async (req: Request, res: Response) => {
  try {
    const registeredUser = await registerUser(req, res);
    res.send(registeredUser);
  } catch (error: any) {
    res.status(400).json(error);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const loggedInUser = await loginUser(req, res);
    res.send(loggedInUser);
  } catch (error: any) {
    res.status(400).json(error);
  }
});

router.get("/logout", authenticate, async (req, res) => {
  try {
    const loggedOutUser = await logoutUser(req, res);
    res.status(201).json(loggedOutUser);
  } catch (error: any) {
    res.status(400).json(error);
  }
});

router.get(
  "/get-all-transactions",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const createdSession = await getAllTransactions(req, res);
      res.status(201).json(createdSession);
    } catch (error: any) {
      res.status(400).json(error);
    }
  }
);

router.post("/create-checkout-session", authenticate, async (req, res) => {
  try {
    const createdSession = await createCheckoutSession(req, res);
    res.status(201).json(createdSession);
  } catch (error: any) {
    res.status(400).json(error);
  }
});

router.get("/validuser", authenticate, async (req, res) => {
  try{
    const validUser = await getValidUser(req, res);
    res.send(validUser);
  }catch(error){
    res.status(400).json(error);
  }
});

export default router;
