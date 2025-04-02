import dotenv from "dotenv";
dotenv.config();
import express from "express";

import connectDB from "./config/db.js";
import mainRouter from "./routes/main.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.use(express.json());
console.log("MONGODB_URL>>>>>>>>>", process.env.MONGODB_URL);
console.log("JWT_ACCESS?????????", process.env.JWT_ACCESS);
console.log("JWT_REFRESH!!!!!!!!!!!!!!", process.env.JWT_REFRESH);
console.log("PRIVATE_KEY$$$$$$$$$$$", process.env.PRIVATE_KEY);

connectDB();

app.use("/", mainRouter);

app.listen(5000, () => console.log(`Server running on port 5000`));
