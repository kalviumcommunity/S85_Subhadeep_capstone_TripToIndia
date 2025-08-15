import express from "express";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/jwt.js";
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from "../utils/emailService.js";
import { generateOTP, sendLoginOTP, sendSignupOTP, sendWelcomeEmail } from "../utils/otpService.js";

const router = express.Router();

// POST: Check Email Existence
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!"
      });
    }

    const existingUser = await User.findOne({ email });

    res.status(200).json({
      success: true,
      exists: !!existingUser,
      message: existingUser ? "Email already registered" : "Email available"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Register User (Direct Registration - No OTP)
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password, role } = req.body;
    if (!firstname || !lastname || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email!"
      });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be 6+ chars with uppercase, lowercase, number, and special character."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (verified by default since no email verification)
    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: role || 'user',
      isEmailVerified: true, // Set to true since we're not doing email verification
      isOtpVerified: true
    });

    await newUser.save();

    // Generate JWT token for immediate login
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to TripToIndia!",
      token,
      user: {
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        authProvider: newUser.authProvider,
        isEmailVerified: newUser.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Verify Signup OTP
router.post("/verify-signup-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required!"
      });
    }

    // Find user with valid OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
      otpPurpose: 'signup'
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP!"
      });
    }

    // Verify user
    user.isEmailVerified = true;
    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;

    await user.save();

    // Send welcome email
    await sendWelcomeEmail(email, user.firstname);

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to TripToIndia!",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Login user (Direct Login - No OTP)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password!" });
    }

    // Check if this is a social login user
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: `This account is linked with ${user.authProvider}. Please use ${user.authProvider} login.`
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password!" });
    }

    // Generate JWT token for immediate login
    const token = generateToken(user._id);

    // Success - Direct login
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authProvider: user.authProvider,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Verify Login OTP
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required!"
      });
    }

    // Find user with valid OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
      otpPurpose: 'login'
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP!"
      });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    user.isOtpVerified = true;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Success
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authProvider: user.authProvider,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Email and purpose are required!"
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpPurpose = purpose;
    await user.save();

    // Send appropriate OTP email
    let emailResult;
    if (purpose === 'login') {
      emailResult = await sendLoginOTP(email, otp, user.firstname);
    } else if (purpose === 'signup') {
      emailResult = await sendSignupOTP(email, otp, user.firstname);
    }

    if (emailResult && emailResult.success) {
      res.status(200).json({
        success: true,
        message: "New verification code sent successfully!"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send verification code. Please try again."
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Forgot Password (Disabled - Email service not configured)
router.post("/forgot-password", async (req, res) => {
  res.status(503).json({
    success: false,
    message: "Password reset feature is temporarily unavailable. Please contact support for assistance."
  });
});

// POST: Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required!"
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters with uppercase, lowercase, number, and special character."
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token!"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Send confirmation email
    await sendPasswordResetConfirmation(user.email, user.firstname);

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
});

// GET: Verify Reset Token
router.get("/verify-reset-token/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token!"
      });
    }

    res.status(200).json({
      success: true,
      message: "Valid reset token",
      email: user.email
    });

  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
});

export default router
