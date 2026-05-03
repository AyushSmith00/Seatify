import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";
import Layout from "../components/Layout";

function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    price: "",
    totalSeats: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/events/create",
        {
          ...form,
          price: Number(form.price),
          totalSeats: Number(form.totalSeats),
        },
        { withCredentials: true }
      );

      alert("Event Created 🎉");
      navigate("/");
    } catch (error) {
      console.error(error.response?.data);
      alert("Failed to create event");
    }
  };

  return (
    <Layout>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <p className="text-gray-400 text-sm">
          Publish a new event for users to book
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-2xl">

        <form
          onSubmit={handleSubmit}
          className="
            bg-gradient-to-br from-[#111827] to-[#0b1220]
            border border-gray-800
            p-6 rounded-2xl
            shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
            space-y-6
          "
        >

          {/* SECTION: BASIC INFO */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Basic Info</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="description"
                placeholder="Event Description"
                rows="3"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SECTION: DETAILS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Details</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="datetime-local"
                name="date"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SECTION: PRICING */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Pricing & Capacity</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price (₹)"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="totalSeats"
                placeholder="Total Seats"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            Create Event
          </button>
        </form>
      </div>

    </Layout>
  );
}

export default CreateEvent;
