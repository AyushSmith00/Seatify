import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EventDetails from "./pages/eventDetails.jsx";
import MyBookings from "./pages/MyBooking.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import EventStats from "./pages/EventStats.jsx";


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/event-stats" element={<EventStats />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
