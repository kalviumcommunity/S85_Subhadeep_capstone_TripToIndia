import express from "express";
import User from "../models/UserSchema.js";

const router = express.Router();

// POST: Register new user
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    if (!firstname || !lastname || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email!" });
    }
    // Save new user
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User created successfully!", newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
