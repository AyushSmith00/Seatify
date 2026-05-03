import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api.js";
import Layout from "../components/Layout";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    API.get(`/events/${id}`).then(res => setEvent(res.data.event));
  }, [id]);

  if (!event) return <Layout>Loading...</Layout>;

  return (
    <Layout>

      <div className="max-w-2xl mx-auto">

        <div className="
          bg-gradient-to-br from-[#111827] to-[#0b1220]
          border border-gray-800
          p-6 rounded-2xl
        ">

          <h1 className="text-3xl font-bold mb-2">
            {event.title}
          </h1>

          <p className="text-gray-400 mb-4">
            {event.description}
          </p>

          <div className="space-y-2 text-sm">
            <p>📍 {event.location}</p>
            <p>📅 {new Date(event.date).toLocaleString()}</p>
            <p>🎟 Seats: {event.availableSeats}</p>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-2xl font-bold">
              ₹{event.price}
            </span>

            <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg">
              Book Now
            </button>
          </div>

        </div>

      </div>

    </Layout>
  );
}
