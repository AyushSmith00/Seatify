import { useState, useEffect } from "react";
import API from "../services/api.js";

function Home(){

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvent = async() => {
            try {

                const res = await API.post("/events")
                setEvents(res.data)

            } catch (error) {
                console.error(error);
            };
        };

        fetchEvent()
    }, [])

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl mb-4">All Events</h1>

            <div className="grid gap-4">
                {events.map((event) => (
                <div
                    key={event.id}
                    className="bg-gray-800 p-4 rounded">
                    <h2 className="text-xl">{event.title}</h2>
                    <p>{event.description}</p>
                    <p>Seats: {event.availableSeats}</p>
                </div>
                ))}
            </div>
        </div>
    );
}