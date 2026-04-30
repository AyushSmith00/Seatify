import { useState, useEffect } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";

function Home(){

    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchEvent = async() => {
            try {

                const res = await API.get("/events")
                setEvents(res.data.events)

            } catch (error) {
                console.error(error);
            };
        };


        fetchEvent()
    }, [])

    const handleBooking = async(eventId, quantity) => {
        try {
            
            const res = await API.post(`/booking/${eventId}`, {quantity});

            alert("Ticket Booked!");

            setEvents((prev) => prev.map((event) => event.id == eventId ? {...event, availableSeats: event.availableSeats - quantity}: event))

        } catch (error) {
            console.log(error.response?.data);
        }
    }


    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl mb-4">All Events</h1>

            <div className="grid gap-4">
                {Array.isArray(events) && events.map((event) => (
                <div
                    key={event.id}
                    className="bg-gray-800 p-4 rounded">
                    <h2 className="text-xl">{event.title}</h2>
                    <p>{event.description}</p>
                    <p>Seats: {event.availableSeats}</p>

                    <button onClick={() => handleBooking(event.id)} className="bg-green-500 px-4 py-2 rounded mt-2">Book Ticket</button>
                </div>
                ))}
            </div>
        </div>
    );
}

export default Home