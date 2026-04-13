import express from "express"
import { registerUser, loginUser, refreshAccessToken, logout} from "../controllers/auth.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

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

router.get("/organizer-dashboard", protect, authorizeRoles("ORGANIZER"), (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome Organizer!",
        user: req.user,
    });
});

router.post("/refresh", refreshAccessToken);
router.post("/logout",protect, logout);

export default router;

