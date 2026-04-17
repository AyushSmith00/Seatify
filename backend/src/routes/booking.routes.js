import express from "express"
import { createBooking, getMyBookings, createOrder, verifyPayment} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router()

router.get("/my-bookings", protect, authorizeRoles("CUSTOMER"), getMyBookings)
router.post("/create-order/:eventId", protect, authorizeRoles("CUSTOMER"), createOrder);
router.post("/verify-payment", protect, authorizeRoles("CUSTOMER"), verifyPayment);
router.post("/:eventId", protect, authorizeRoles("CUSTOMER"), createBooking);


export default router