import { useEffect, useState } from "react";
import API from "../services/api.js";
import Layout from "../components/Layout.jsx"
import { useNavigate } from "react-router-dom";

export default function MyEvents() {
    
    const[events, setEvents] = useState("")
    const navigate = useNavigate()

    useEffect(() => {fetchMyEvent()}, [])

    const fetchMyEvent = async() => {
        try {
            const res = await API.get("/events/my-events", {
                withCredentials: true
            });

            setEvent(res.data.events)

        } catch (error) {
            console.error(error);
            setEvents([]);
        }
    };

    const handleDelete = async() => {

        const confirmDelete = window.confirm("Are you sure you want to delete this event?");

        if(!confirmDelete) return;

        try {
            
            await API.delete(`/events/${id}`, {
                withCredentials: true
            })

            setEvents(events.filter((events) => event.id !== id));

            alert("Event deleted successfully");

        } catch (error) {

            console.error(error);
            alert("Failed to delete event");
        }
    }

    return(
        <Layout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Events</h1>

                <p className="text-gray-400 text-sm">
                    Manage all your created events
                </p>
            </div>

            {events.length ===0 ? (

                <p className="text-gray-400">
                    No events created yet.
                </p>
            ): (
                <div className="grid md:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div 
                            key={event.id}
                            className="
                                bg-gradient-to-br from-[#111827] to-[#0b1220]
                                border border-gray-800
                                p-5 rounded-2xl
                                hover:-translate-y-1 hover:shadow-xl
                                transition duration-300"
                        >
                            <h2 className="text-xl font-semibold">{event.title}</h2>
                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{event.description}</p>

                            <div className="mt-4 space-y-2 text-sm text-gray-400">
                                <p>📍{event.location}</p>
                                <p>📅{" "} {new Date(event.date).toLocaleDateString("en-IN")}</p>
                                <p>🎟 {event.availableSeats} / {event.totalSeats} seats left</p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-lg font-bold">₹{event.price}</p>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button 
                                    onClick={() => navigate(`/edit-event/${event.id}`)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-sm"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-lg text-sm"
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            )}
        </Layout>
    );
}