import prisma from "../config/prisma.js";

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
                    availableSeats: event.availableSeats - Number(quantity)
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