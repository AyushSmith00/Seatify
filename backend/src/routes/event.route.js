import express from "express"
import { createEvent, getAllevents } from "../controllers/event.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import {authorizeRoles} from "../middleware/role.middleware.js"

const router = express();

router.post("/create", protect, authorizeRoles("ORGANIZER"), createEvent);
router.get("/", getAllevents);

export default router;