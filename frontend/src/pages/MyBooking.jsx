import { useEffect, useState } from "react";
import API from "../services/api.js";
import Layout from "../components/Layout";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/my-bookings", { withCredentials: true })
      .then(res => setBookings(res.data.bookings))
      .catch(() => setBookings([]));
  }, []);

  return (
    <Layout>

      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {bookings.map(b => (
            <div key={b.id}
              className="
              bg-gradient-to-br from-[#111827] to-[#0b1220]
              border border-gray-800
              p-5 rounded-2xl
              hover:-translate-y-1 hover:shadow-xl
              transition
              "
            >
              <h2 className="text-lg font-semibold">{b.event.title}</h2>

              <p className="text-gray-400 text-sm mt-1">
                {new Date(b.event.date).toLocaleString()}
              </p>

              <p className="mt-2">Qty: {b.quantity}</p>

              <p className="mt-2 font-semibold text-lg">
                ₹{b.totalPrice}
              </p>
            </div>
          ))}
        </div>
      )}

    </Layout>
  );
}
