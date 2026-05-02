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



    return (
    <div className="p-6 text-white">
      
      <div className="mb-4">
        <h2 className="text-lg">Logged in as: {user?.email}</h2>
        <h3 className="text-md">Role: {user?.role}</h3>
      </div>


      {user?.role === "ORGANIZER" && (
        <button
          onClick={() => navigate("/create-event")}
          className="bg-blue-500 px-4 py-2 rounded mb-4"
        >
          Create Event
        </button>
      )}

      <h1 className="text-2xl mb-4">All Events</h1>

      <div className="grid gap-4">
        {Array.isArray(events) &&
          events.map((event) => (
            <div key={event.id} className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl">{event.title}</h2>
              <p>{event.description}</p>
              <p>Seats: {event.availableSeats}</p>
              <p>Price: ₹{event.price}</p>

              
              {user?.role === "CUSTOMER" && (
                <button
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="bg-green-500 px-4 py-2 rounded mt-2"
                >
                  view Details
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;