import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";

const JWT_ACCESS = process.env.JWT_ACCESS;

export const verifyVC = (allowedRoles) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. No token provided." });
    }
    const date = new Date().toISOString();
    try {
      const decoded = jwt.verify(token, JWT_ACCESS);
      req.user = decoded;

      const user = await User.findOne({ address: req.user.address });
      console.log(decoded);
      if (
        !user &&
        !user.address &&
        user.vc.issuer === decoded.vc.issuer &&
        decoded.vc.issuanceDate < date
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied. No valid VC found.",
        });
      }

      const userRole = user.role;

      // Check if the role is allowed
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token." });
    }
  };
};
