import { error } from "console";
import prisma from "../config/prisma.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto"
import { removeAllListeners } from "cluster";

export const createBooking = async (req, res) => {
  try {
    const { eventId } = req.params;
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const result = await prisma.$transaction(async (tx) => {

      const event = await tx.event.findUnique({
        where: { id: Number(eventId) },
      });

      if (!event) {
        throw new Error("Event not found");
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

      
      if (event.availableSeats < quantity) {
        throw new Error("Not enough seats available");
      }

      const totalPrice = event.price * quantity;

      const booking = await tx.booking.create({
        data: {
          userId: req.user.id,
          eventId: event.id,
          quantity,
          totalPrice,
        },
      });

      const updatedEvent = await tx.event.update({
        where: { id: event.id },
        data: {
          availableSeats: {
            decrement: quantity,
          },
        },
      });

      return { booking, updatedEvent };
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: result.booking,
      remainingSeats: result.updatedEvent.availableSeats,
    });

  } catch (error) {
    if (
      error.message === "Event not found" ||
      error.message === "Not enough seats available" ||
      error.message === "You already booked this event"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

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
