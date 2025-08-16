import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import router from "./routes/router.js";
import cors from "cors";
import placeRouter from "./routes/PlaceRouter.js";
import geocodeRouter from "./routes/geocodeRouter.js";
import authRouter from "./routes/auth.js";
import passport from "./config/passport.js";
import session from "express-session";

// Load environment variables
dotenv.config({ path: './config/.env' });

// Debug environment variables
console.log('🌍 Environment Variables Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('Google Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 60 * 1000 // 5 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("HI WELCOME TO MY WEBSITE");
});

app.use("/api", geocodeRouter);
app.use("/api", router);         // User routes
app.use("/api/add", placeRouter); // Place routes
app.use("/api/v1/auth", authRouter); // OAuth routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
