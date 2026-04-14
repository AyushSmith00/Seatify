import express from "express"
import { createEvent, getAllevents, getSingleEvent, getMyEvents } from "../controllers/event.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import {authorizeRoles} from "../middleware/role.middleware.js"

const router = express.Router();

router.post("/create", protect, authorizeRoles("ORGANIZER"), createEvent);
router.get("/", getAllevents);
router.get("/:id", getSingleEvent);
router.get("/my-events", protect, authorizeRoles("ORGANIZER"), getMyEvents);


export default router;