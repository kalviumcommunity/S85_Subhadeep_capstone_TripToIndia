import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minLength: [3, "First name must contain at least 3 characters!"],
    maxLength: [30, "First name cannot exceed 30 characters!"],
  },
  lastname: {
    type: String,
    required: true,
    minLength: [3, "Last name must contain at least 3 characters!"],
    maxLength: [30, "Last name cannot exceed 30 characters!"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Provide a valid email!"],
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "Phone number must be exactly 10 digits!",
    },
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not Google login
    },
    minLength: [6, "Password must be at least 6 characters long!"],
  },
  role:{
    type: String,
    required: true,
    default: "user"
  },
  // Social Authentication fields
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  profilePicture: {
    type: String, // URL to profile picture from Google
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Password Reset fields
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  // OTP fields
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  otpPurpose: {
    type: String,
    enum: ['login', 'signup', 'verification'],
    default: 'verification'
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", userSchema);

export default User;
