import express from "express"
import { registerUser } from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/test",(req, res) => {
    res.json({
        message: "Auth router is working"
    })
})

router.post("/register", registerUser)

export default router

