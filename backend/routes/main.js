import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { authenticateMetaMask, logout } from "../controllers/authcontroller.js";
import {
  additionaluserinfo,
  userUpdate,
  users,
} from "../controllers/userscontroller.js";
import { verifyVC } from "../middlewares/isadmin.js";
import { refreshAccessToken } from "../controllers/refreshtoken.js";

const router = express.Router();
const DEV_MODE = process.env.DEV_MODE;
router.use(
  cors({
    credentials: true,
    origin:
      DEV_MODE === "development"
        ? "http://localhost:5173"
        : "https://web3-assignment.netlify.app",
  })
);

router.post("/refresh_token", refreshAccessToken);

router.post("/api/auth/metamask", authenticateMetaMask);
router.post("/additionaluserinfo", additionaluserinfo);
router.get("/users", verifyVC(["Admin", "Premium"]), users);
router.put(
  "/admin/upgrade/:userId",
  verifyVC(["Admin", "Premium"]),
  userUpdate
);
router.post("/logout", logout);

export default router;
