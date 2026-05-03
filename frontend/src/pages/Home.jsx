import { useEffect, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/events")
      .then(res => setEvents(res.data.events))
      .catch(() => setEvents([]));
  }, []);

  return (
    <Layout>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Events</h1>
        <p className="text-gray-400 text-sm">
          Discover and book amazing events
        </p>
      </div>

      {/* EMPTY STATE */}
      {events.length === 0 ? (
        <p className="text-gray-400">No events available.</p>
      ) : (

        <div className="grid md:grid-cols-3 gap-6">

          {events.map((event) => (
            <div
              key={event.id}
              className="
                bg-gradient-to-br from-[#111827] to-[#0b1220]
                border border-gray-800
                p-5 rounded-2xl
                hover:-translate-y-1 hover:shadow-xl
                transition duration-300
              "
            >
              {/* TITLE */}
              <h2 className="text-xl font-semibold">
                {event.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {event.description}
              </p>

              {/* LOCATION + DATE */}
              <div className="mt-3 space-y-1 text-sm text-gray-400">
                <p>📍 {event.location}</p>
                <p>📅 {new Date(event.date).toLocaleDateString("en-IN")}</p>
              </div>

              {/* PRICE */}
              <p className="mt-3 font-semibold text-lg">
                ₹{event.price}
              </p>

              {/* BUTTON */}
              <button
                onClick={() => navigate(`/event/${event.id}`)}
                className="
                  mt-4 w-full
                  bg-green-600 hover:bg-green-700
                  transition p-2 rounded-lg
                  font-medium
                "
              >
                View Details
              </button>
            </div>
          ))}

        </div>
      )}

    </Layout>
  );
}

export default Home;
