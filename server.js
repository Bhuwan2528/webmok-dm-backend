import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/AuthRoutes.js"
import entryRoutes from "./routes/EntryRoutes.js";

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("✅ MongoDB Connected"))
.catch((err)=> console.log(err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/entries", entryRoutes);

// Test route
app.get("/",(req,res)=>{
    res.send("✅Backend running")
})

// Server start
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`)
})