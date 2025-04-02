import dotenv from "dotenv";
dotenv.config();
import express from "express";

import connectDB from "./config/db.js";
import mainRouter from "./routes/main.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.use(express.json());

connectDB();

app.use("/", mainRouter);

app.listen(5000, () => console.log(`Server running on port 5000`));
