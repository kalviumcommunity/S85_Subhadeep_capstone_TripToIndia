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


// ✅ Read All Users (GET)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Read Single User (GET)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ✅ Update User (PUT)
router.put('/user/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Delete User (DELETE)
router.delete("/user/:id",async(req,res)=>{
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if(!deleteUser)return res.status(404).json({message:"User not found"});
    res.status(200).json({ message: 'User deleted successfully', user: deleteUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;
