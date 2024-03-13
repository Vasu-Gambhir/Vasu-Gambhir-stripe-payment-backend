import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
dotenv.config();

import "./db/db";

const app: Application = express();
const port = process.env.PORT || 8000;

import cors from "cors";
const cookieParser = require("cookie-parser");

import router from "./routes/routes";

app.use(express.json());
app.use(cookieParser(""));


app.use(
  cors({
    origin: ["http://localhost:3000", "https://stripe-payment-frontend-psi.vercel.app"],
    credentials: true,
    // exposedHeaders: ["set-cookie"],
  })
);

app.use(router);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
