import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/AuthRoutes.js"
import entryRoutes from "./routes/EntryRoutes.js";

dotenv.config()

const app = express()

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://webmok-dm.vercel.app"
]

const corsOptions = {
  origin: function (origin, callback) {

    // allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("✅ MongoDB Connected"))
.catch((err)=> console.log(err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/entries", entryRoutes)

app.get("/",(req,res)=>{
    res.send("✅ Backend running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`)
})