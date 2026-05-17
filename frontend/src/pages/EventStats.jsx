import { useState, useEffect } from "react";
import API from "../services/api.js"
import Layout from "../components/Layout.jsx"

export default function EventStats() {

    const [stats, setStats] = useState("")

    useEffect(() => {fetchStast()}, [])

    const fetchStast = async() => {
        
        try {

            const res = await API.get("/events/my-events/stats", {
                withCredentials: true,
            });

            setStats(res.data.stats);

        } catch (error) {
            
            console.error(error);
            setStats([]);
        }
    };

    return (
        <Layout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Event Analytics</h1>
                <p className="text-gray-400 text-sm">Track bookings and revenue</p>
            </div>

            {stats.length === 0 ? (
                <p className="text-gray-400">No stats available yet.</p>
            ):(
                <div className="grid md:grid-cols-3 gap-6">
                    {stats.map((item) => (
                        <div 
                            key={item.eventId}
                            className="
                                bg-gradient-to-br from-[#111827] to-[#0b1220]
                                border border-gray-800
                                p-6 rounded-2xl
                                hover:-translate-y-1
                                transition"
                        >
                            <h2 className="text-xl font-semibold mb-4">{item.title}</h2>

                            <div className="space-y-3">

                                <div className="bg-[#020617] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Total Revenue</p>
                                    <p className="text-2xl font-bold">₹{item.totalRevenue}</p>
                                </div>

                                <div className="bg-[#020617] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Tickets Sold</p>
                                    <p className="text-2xl font-bold">{item.totalTicketSold}</p>
                                </div>

                                <div className="bg-[#020617] p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">Total Bookings</p>
                                    <p className="text-2xl font-bold">{item.totalbooking}</p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    )
}