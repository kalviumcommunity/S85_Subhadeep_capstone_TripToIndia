import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js"
import router from "./routes/router.js"

dotenv.config({ path: './config/.env' })

const app=express()
app.use(express.json())
connectDB()
const PORT=process.env.PORT
app.get("/",(req,res)=>{
    res.send("HI WELCOME TO MY WEBSITE")
})

app.use("/api",router)

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})