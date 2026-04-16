import express from "express"
import { createEvent, getAllevents, getSingleEvent, getMyEvents, getBookingsForMyEvents, getEventsStats, updateEvent, deleteEvent } from "../controllers/event.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import {authorizeRoles} from "../middleware/role.middleware.js"

const router = express.Router();

router.post("/create", protect, authorizeRoles("ORGANIZER"), createEvent);
router.get("/my-events", protect, authorizeRoles("ORGANIZER"), getMyEvents);
router.get("/my-events/bookings", protect, authorizeRoles("ORGANIZER"), getBookingsForMyEvents)
router.get("/my-events/stats", protect, authorizeRoles("ORGANIZER"), getEventsStats);
router.get("/", getAllevents);

router.put("/:id", protect, authorizeRoles("ORGANIZER"), updateEvent);
router.delete(("/:id", protect, authorizeRoles("ORGANIZER"), deleteEvent));

router.get("/:id", getSingleEvent);

export default router;