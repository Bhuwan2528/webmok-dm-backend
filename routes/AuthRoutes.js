import express from "express"
import jwt from "jsonwebtoken"
import verifyAdmin from "../middleware/AuthMiddleware.js"

const router = express.Router()

// Admin login
router.post("/login",(req,res)=>{

    const {username,password} = req.body

    if(
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ){

        const token = jwt.sign(
            {admin:true},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )

        return res.json({
            message:"Login successful",
            token
        })
    }

    res.status(401).json({message:"Invalid credentials"})
})


// Logout (client side token delete)
router.post("/logout",(req,res)=>{
    res.json({message:"Logged out"})
})


router.get("/dashboard", verifyAdmin,(req,res)=>{
    res.json({message:"Protected route working"})
})



export default router