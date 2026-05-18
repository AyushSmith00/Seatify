import { useState, useEffect } from "react";
import API from "../services/api.js"
import Layout from "../components/Layout.jsx";

export default function EventBooking(){

    const [events, setEvents] = useState([])

    useEffect(() => fetchBooking(), [])

    const fetchBooking = async() => {
        try {
            
            const res = await API.get("/events/my-events/bookings", {
                withCredentials: true
            })

            setEvents(res.data.events)

        } catch (error) {
            console.error(error)
            setEvents([])
        }
    }

    return(
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Event Bookings
                </h1>

                <p className="text-gray-400 text-sm">
                    View all customer bookings
                </p>
            </div>

            {events.length === 0 ? (
                <p className="text-gray-400">
                    No booking yet
                </p>
            ): (
                <div className="space-y-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="
                                bg-gradient-to-br from-[#111827] to-[#0b1220]
                                border border-gray-800
                                rounded-2xl
                                p-6
                            "
                        >
                            <div className="mb-5">
                                <h2 className="text-2xl font-bold">
                                    {event.title}
                                </h2>

                                <p className="text-gray-400 text-sm mt-1">
                                    {event.location} * {" "}
                                    {new Date(event.date).toLocaleDateString("en-IN")}
                                </p>
                            </div>

                            <div>
                                {event.bookings.length === 0 ? (
                                    <p className="text-gray-500">No booking for this event</p>
                                ): (
                                    <div className="space-y-4">
                                        {event.bookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="
                                                    bg-[#020617]
                                                    border border-gray-800
                                                    rounded-xl
                                                    p-4
                                                    flex justify-between items-center
                                                "
                                            >
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {booking.user.username}
                                                    </h3>

                                                    <p className="text-sm text-gray-400">
                                                        {booking.user.email}
                                                    </p>
                                                </div>

                                                <div className="text-right text-sm">
                                                    <p>text-right text-sm</p>
                                                    <p>💰 ₹{booking.totalPrice}</p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {new Date(
                                                            booking.createdAt
                                                        ).toLocaleDateString("en-IN")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    )
}