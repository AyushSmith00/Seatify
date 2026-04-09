import express from "express"
import { createBooking } from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express()

router.post("/:eventId", protect, authorizeRoles("CUSTOMER"), createBooking);

export default router