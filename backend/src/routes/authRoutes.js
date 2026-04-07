import express from "express"
import { registerUser, loginUser} from "../controllers/auth.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/test",(req, res) => {
    res.json({
        message: "Auth router is working"
    });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "route access successfully",
        user: req.user,
    });
});

export default router;

