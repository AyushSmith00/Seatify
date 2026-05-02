import express from "express"
import {getMyBookings} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";''
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router()

router.get("/my-bookings", protect, authorizeRoles("CUSTOMER"), getMyBookings)


export default router