import express from "express"
import { createBooking, getMyBookings} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express()

router.get("/my-bookings", protect, authorizeRoles("CUSTOMER"), getMyBookings)
router.post("/:eventId", protect, authorizeRoles("CUSTOMER"), createBooking);

export default router