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

        const {page = 1, limit = 10, location, priceMin, priceMax} = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const filter = {};

        if(location){
            filter.location = {
                contains: location,
                case: "insensitive",
            }
        };

        if(priceMin || priceMax){
            filter.price = {};
            if(priceMin) filter.price.gte = Number(priceMin);
            if(priceMax) filter.price.lte = Number(priceMax);
        }


        const events = await prisma.event.findMany({

            where: filter,
            skip,
            take: Number(limit),
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

        const total = await prisma.event.count({
            where: filter,
        })

        return res.status(200).json({
            success: true,
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / limit),
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

export const getSingleEvent = async(req,res) => {
    try {
        const {id} = req.params;

        const event = await prisma.event.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        return res.status(200).json({
            success: true,
            event,
        });


    } catch (error) {
        console.error("SingleEvent Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const getMyEvents = async(req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                organizerId: req.user.id
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                organizer: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            count: events.length,
            events,
        });

    } catch (error) {
        console.error("GetMyEvents Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    };
};

export const getBookingsForMyEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                organizerId: req.user.id
            },
            include: {
                bookings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });


    } catch (error) {
        console.error("Get Booking for my event Error", error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    };
};

export const getEventsStats = async(req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                organizerId: req.user.id
            },
            include: {
                bookings: true,
            },
        });

        const stats = events.map(event => {
            const totalbooking = event.bookings.length;

            const totalTicketSold = event.bookings.reduce(
                (sum, b) => sum + b.quantity,
                0 
            );

            const totalRevenue = event.bookings.reduce(
                (sum, b) => sum + b.totalPrice,
                0
            );

            return {
                eventId: event.id,
                title: event.title,
                totalbooking,
                totalTicketSold,
                totalRevenue,
            };
        });

        return res.status(200).json({
            success: true,
            stats,
        })

    } catch (error) {
        console.error("Get events stats Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const updateEvent = async(req, res) => {
    try {
        const {id} = req.params

        const event = await prisma.event.findUnique({
            where: {id : Number(id)}
        })

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        if(event.organizerId !== req.user.id){
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this event"
            })
        }

        const updatedEvent = await prisma.event.update({
            where: {
                id: Number(id)
            },
            data: {
                ...req.body,
                date: req.body.date ? new Date(req.body.date) : undefined
            },
        });

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event: updatedEvent
        })


    } catch (error) {
        console.error("Update Event Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const deleteEvent = async(req, res) => {
    try {
        const {id} = req.params

        const event = await prisma.event.findUnique({
            where: {
                id: Number(id),
            },
        });

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not Found"
            })
        }

        if(event.organizerId !== req.user.id){
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this event"
            })
        }

        await prisma.event.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({
            success: true,
            message: "Event deleted Successfully"
        })

    } catch (error) {
        console.error("Delete Event Error", error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}