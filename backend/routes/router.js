import express from "express";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// POST: Register new user
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password, role } = req.body;
    if (!firstname || !lastname || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email!" });
    }

    // 🔐 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user with hashed password
    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!", newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Login user
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

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password!" });
    }

    // Success
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router