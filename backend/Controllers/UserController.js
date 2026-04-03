// Controller/UserController.js

import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// 📧 EMAIL SENDER SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 📩 SEND EMAIL FUNCTION (Professional & Polished)
const sendOTPEmail = async (email, otp) => {
  const currentYear = new Date().getFullYear();

  await transporter.sendMail({
    from: `"Studly Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${otp} is your Studly verification code`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #333333; border: 1px solid #f0f0f0; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">Studly</h1>
        </div>

        <div style="line-height: 1.6;">
          <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">Verify your email address</h2>
          <p style="margin-bottom: 24px; color: #4B5563;">Hello,</p>
          <p style="margin-bottom: 24px; color: #4B5563;">
            To finish setting up your account and ensure your security, please use the following verification code. This code is valid for <b>3 minutes</b>.
          </p>

          <div style="background-color: #F3F4F6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="display: block; font-size: 12px; text-transform: uppercase; tracking: 0.1em; color: #6B7280; margin-bottom: 8px; font-weight: 600;">Verification Code</span>
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; color: #111827; letter-spacing: 8px;">${otp}</span>
          </div>

          <p style="font-size: 14px; color: #6B7280; margin-bottom: 32px;">
            <i>If you didn't request this code, you can safely ignore this email. Someone may have typed your email address by mistake.</i>
          </p>
          
          <hr style="border: 0; border-top: 1px solid #E5E7EB; margin-bottom: 24px;">
          
          <p style="font-size: 13px; color: #9CA3AF; text-align: center;">
            Sent with 💙 from the Studly Team<br>
            &copy; ${currentYear} Studly Inc. All rights reserved.
          </p>
        </div>
      </div>
    `
  });
};

// 🟢 REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User(req.body);

    // 🔢 generate OTP
    const otp = user.generateEmailOTP();

    await user.save();

    // 📧 send email
    await sendOTPEmail(user.email, otp);

    res.status(201).json({
      message: "User registered. OTP sent to email"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔵 VERIFY EMAIL OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = user.verifyEmailOTP(otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await user.save();

    res.json({ message: "Email verified successfully. You can login now." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🟡 LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 block if not verified
    if (!user.emailVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    // 🔐 JWT TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔄 RESEND OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = user.generateEmailOTP();

    await user.save();

    await sendOTPEmail(user.email, otp);

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};