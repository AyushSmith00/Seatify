import prisma from "../config/prisma.js";

export const createEvent = async(req, res) => {
    try {
        const {title, description, location, date, totalSeats, price} = req.body;

        if(!title || !location || !date || !totalSeats || !price){
            return res.status(400).json({
                success: false,
                message: "All the Fields are required"
            })
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                location,
                date: new Date(date),
                totalSeats: Number(totalSeats),
                availableSeats: Number(totalSeats),
                price: Number(price),
                organizerId: req.user.id
            },
        });

        return res.status(201).json({
            success: true,
            message: "Event created Successfully",
            event,
        })

    } catch (error) {
        console.error("Create Event Error", error)
        return res.json({
            success: false,
            message: "Server error"
        });
    };
};

export const getAllevents = async(req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                createdAt: "desc",
            },

            include: {
                organizer: {
                    select: {
                        id: true,
                        username:true,
                        email: true,
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            count: events.length,
            events,
        })


    } catch (error) {
        console.error("Get all Events Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}