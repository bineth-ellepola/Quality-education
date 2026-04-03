// Route/UserRoute.js

import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  resendOTP,
  getUserById
} from "../Controllers/UserController.js";

const router = express.Router();

// 🟢 Register
router.post("/register", registerUser);
router.get("/:id", getUserById);

// 🔵 Verify OTP
router.post("/verify-email", verifyEmail);

// 🟡 Login
router.post("/login", loginUser);

// 🔄 Resend OTP
router.post("/resend-otp", resendOTP);

export default router;