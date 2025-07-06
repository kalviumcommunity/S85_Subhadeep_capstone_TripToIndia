import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import router from "./routes/router.js";
import cors from "cors";
import placeRouter from "./routes/PlaceRouter.js";

dotenv.config({ path: './config/.env' });

const app = express();
app.use(cors());
app.use(express.json());


connectDB();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("HI WELCOME TO MY WEBSITE");
});

app.use("/api", router);         // User routes
app.use("/add", placeRouter);    // Place routes

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
