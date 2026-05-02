import { error } from "console";
import prisma from "../config/prisma.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto"


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
