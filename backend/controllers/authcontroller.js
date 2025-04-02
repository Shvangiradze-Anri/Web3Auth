import dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";

const JWT_ACCESS = process.env.JWT_ACCESS;
const JWT_REFRESH = process.env.JWT_REFRESH;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DEV_MODE = process.env.DEV_MODE;

export const authenticateMetaMask = async (req, res) => {
  try {
    const { address, message, signature } = req.body;

    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    let user = await User.findOne({ address });
    if (!user) {
      user = new User({ address });
      await user.save();
    }

    const vc = await createVerifiableCredential(user);

    const token = generateAccessToken(user.address, vc);
    const refreshToken = generateRefreshToken(user.address, vc);

    if (vc && refreshToken) {
      user.token = refreshToken;
      user.vc = vc;
      await user.save();
    }

    return res
      .cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
      })
      .json({ success: true, token, vc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

const createVerifiableCredential = async (user) => {
  const vc = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    issuer:
      DEV_MODE === "development"
        ? "http://localhost:5173"
        : "https://web3-assignment.netlify.app",
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: `ethereum:${user._id}`,
      role: user.role,
      name: user.name,
      email: user.email,
    },
  };

  const signedVC = await signCredential(vc);
  return signedVC;
};

const signCredential = (credential) => {
  const payload = JSON.stringify(credential);
  const sign = crypto.createSign("SHA256");
  sign.update(payload);
  sign.end();

  const signature = sign.sign(PRIVATE_KEY, "hex");
  credential.proof = {
    type: "RsaSignature2018",
    created: new Date().toISOString(),
    creator:
      DEV_MODE === "development"
        ? "http://localhost:5173"
        : "https://web3-assignment.netlify.app",
    signatureValue: signature,
  };
  return credential;
};

export const generateAccessToken = (address, vc) => {
  return jwt.sign({ address, vc }, JWT_ACCESS, { expiresIn: "10s" });
};

const generateRefreshToken = (address, vc) => {
  return jwt.sign({ address, vc }, JWT_REFRESH, { expiresIn: "7d" });
};
