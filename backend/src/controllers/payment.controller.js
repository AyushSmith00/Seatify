import prisma from "../config/prisma.js";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
    try {
        
        const { eventId, quantity } = req.body;

        const qty = Number(quantity);

        if (!qty || qty < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid quantity",
        });
        }

        const event = await prisma.event.findUnique({
        where: {
            id: Number(eventId),
        },
        });

        if (!event) {
        return res.status(400).json({
            success: false,
            message: "Event not found",
        });
        }

        if (event.availableSeats < qty) {
        return res.status(400).json({
            success: false,
            message: "Not enough seats available",
        });
        }

        const amount = event.price * qty * 100; // 🔥 IMPORTANT FIX (paise)

        const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        });

        return res.status(200).json({
        success: true,
        order,
        eventId,
        quantity: qty,
        });
    } catch (error) {
        console.error("Create order Error", error);
        return res.status(500).json({
        success: false,
        message: "Server Error",
        });
    }
};


export const verifyPayment = async (req, res) => {

    try {
        const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        eventId,
        quantity,
        } = req.body;

        const qty = Number(quantity);

        if (!eventId) {
        return res.status(400).json({
            success: false,
            message: "eventId missing",
        });
        }

        if (!qty || qty < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid quantity",
        });
        }

        const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

        if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });
        }

        const result = await prisma.$transaction(async (tx) => {
        const event = await tx.event.findUnique({
            where: { id: Number(eventId) },
        });

        if (!event) {
            throw new Error("Event not found");
        }

        if (event.availableSeats < qty) {
            throw new Error("Not enough seats available");
        }

        const existingBooking = await tx.booking.findFirst({
            where: {
            userId: req.user.id,
            eventId: event.id,
            },
        });

        if (existingBooking) {
            throw new Error("You already booked this event");
        }

        const totalPrice = event.price * qty;

        const booking = await tx.booking.create({
            data: {
            userId: req.user.id,
            eventId: Number(event.id),
            quantity: qty,
            totalPrice,
            paymentId: razorpay_payment_id,
            },
        });

        const updatedEvent = await tx.event.update({
            where: { id: event.id },
            data: {
            availableSeats: {
                decrement: qty,
            },
            },
        });

        return { booking, updatedEvent };
        });

        return res.status(200).json({
        success: true,
        message: "Payment successful, booking confirmed",
        booking: result.booking,
        });
    } catch (error) {
        console.error("Verify Payment Error:", error);

        return res.status(500).json({
        success: false,
        message: error.message || "Server Error",
        });
    }
};
