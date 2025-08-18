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
import helmet from "helmet";

// Load environment variables
dotenv.config({ path: './config/.env' });

const app = express();

// 1. Trust proxy (still needed for Render.com)
app.set('trust proxy', 1);

// 2. Basic Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://s85-subhadeep-capstone-triptoindia-18.onrender.com'
  ],
  credentials: true
}));

// 3. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Simplified Session Config (Memory Store)
app.use(session({
  secret: process.env.SESSION_SECRET || 'temp-secret-123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// 5. Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// 6. Database Connection
connectDB();

// 7. Routes
app.get("/", (req, res) => {
  res.send("TripToIndia Backend Service");
});

app.use("/api/geocode", geocodeRouter);
app.use("/api", router);
app.use("/api/places", placeRouter);
app.use("/api/v1/auth", authRouter);

// 8. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`Google Auth: ${process.env.GOOGLE_CLIENT_ID ? 'Enabled' : 'Disabled'}`);
});