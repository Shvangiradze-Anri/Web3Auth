import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { generateAccessToken } from "./authcontroller.js";

const JWT_REFRESH = process.env.JWT_REFRESH;

export const refreshAccessToken = async (req, res) => {
  try {
    const cookie = req.cookies.refreshToken;

    if (!cookie) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const decoded = jwt.verify(cookie, JWT_REFRESH);

    const user = await User.findOne({ address: decoded.address });

    if (!user || user.token !== cookie) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(decoded.address, user.vc);

    return res.json({ success: true, accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
