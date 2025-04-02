import express from "express";
import cors from "cors";
import { authenticateMetaMask } from "../controllers/authcontroller.js";
import {
  additionaluserinfo,
  userUpdate,
  users,
} from "../controllers/userscontroller.js";
import { verifyVC } from "../middlewares/isadmin.js";
import { refreshAccessToken } from "../controllers/refreshtoken.js";

const router = express.Router();

router.use(
  cors({ credentials: true, origin: "https://web3-assignment.netlify.app" })
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

export default router;
