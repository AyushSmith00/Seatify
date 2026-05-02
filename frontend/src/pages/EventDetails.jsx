import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api.js";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data.event);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      const { data } = await API.post(
        `/payments/create-order`,
        {eventId: event.id ,quantity },
        { withCredentials: true }
      );

      const { order } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Seatify",
        description: "Event Booking",
        order_id: order.id,

        handler: async function (response) {
          try {
            await API.post(
              `/payments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId: Number(id),
                quantity: Number(quantity),
              },
              { withCredentials: true }
            );

            alert("Booking Successful 🎉");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "User",
          email: "user@example.com",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating order");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl">{event.title}</h1>
      <p>{event.description}</p>
      <p>Location: {event.location}</p>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Price: ₹{event.price}</p>
      <p>Available Seats: {event.availableSeats}</p>

      <input
        type="number"
        value={quantity}
        min="1"
        max={event.availableSeats}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="text-black p-2 mt-2"
      />

      <button
        onClick={handleBooking}
        className="bg-green-500 px-4 py-2 rounded mt-4"
      >
        Book Now
      </button>
    </div>
  );
};

export default EventDetails;
