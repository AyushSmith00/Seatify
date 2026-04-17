import prisma from "../config/prisma.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto"

export const createBooking = async(req, res) => {
    try {
        const {eventId} = req.params
        const {quantity} = req.body

        if(!quantity || Number(quantity) < 1){
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            })
        }

        const event = await prisma.event.findUnique({
            where: {
                id: Number(eventId)
            }
        })

        if(!event){
            return res.status(404).json({
                success: false,
                message: "event not found"
            })
        }

        if(event.availableSeats < Number(quantity)){
            return res.status(400).json({
                success: false,
                message: "Not enough seats available"
            })
        };

        const totalPrice = event.price * Number(quantity);

        const result = await prisma.$transaction(async (tx) => {
            const booking = await tx.booking.create({
                data: {
                    userId: req.user.id,
                    eventId: event.id,
                    quantity: Number(quantity),
                    totalPrice,
                }
            });

            const updatedEvent = await tx.event.update({
                where: {
                    id: event.id,
                },

                data: {
                    availableSeats: {
                        decrement: Number(quantity)
                    }
                },
            });

            return {booking, updatedEvent}
        });

        return res.status(201).json({
            success: true,
            message: "Booking Created Successfully",
            booking: result.booking,
            remainingSeats: result.updatedEvent.availableSeats
        })

    } catch (error) {
        console.error("Create Booking Error:", error);
        return res.status(500).json({
        success: false,
        message: "Server error",
        });
    }
}

export const getMyBookings = async(req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        date: true,
                        price: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            },
        });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        })


    } catch (error) {
        console.error("Get My Booking Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }
}

export const createOrder = async(req, res) => {
    try {
        const {eventId} = req.params;
        const {quantity} = req.body;
        
        const event = await prisma.event.findUnique({
            where: {
                id: Number(eventId)
            }
        })

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not Found"
            })
        }

        const amount = event.price * quantity * 100

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Create Order Error")
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    };
};

export const verifyPayment = async(req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId,
            quantity
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        };

        const event = await prisma.event.findUnique({
            where: {
                id: Number(eventId),
            },
        });

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not Found"
            })
        }

        const totalPrice = event.price * quantity;

        const booking = await prisma.booking.create({
            data: {
                userId: req.user.id,
                eventId: event.id,
                quantity,
                totalPrice,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Payment successful and Booking confirmed",
            booking,
        });


    } catch (error) {
        console.error("Verfiy Payment Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    };
};