import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";

function CreateEvent(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState("")
    const [price, setPrice] = useState(0)
    const [totalSeats, setTotalSeats] = useState(100)

    const navigate = useNavigate()

    const handleSubmit = async() => {
        try {

            await API.post("/events/create", {
                title,
                description,
                location,
                date,
                price: Number(price),
                totalSeats: Number(totalSeats)
            }, {withCredentials: true});

            alert("Event Created");

            navigate("/")

        } catch (error) {
            console.error(error.response?. error)
        }
    } 

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl mb-4">Create Event</h1>

            <input
                placeholder="Title"
                className="block mb-2 p-2 text-black"
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                placeholder="Description"
                className="block mb-2 p-2 text-black"
                onChange={(e) => setDescription(e.target.value)}
            />

            <input  
                placeholder="Location"
                className="block mb-2 p-2 text-black"
                onChange={(e) => setLocation(e.target.value)}
            />

            <input  
                placeholder="Date"
                className="block mb-2 p-2 text-black"
                onChange={(e) => setDate(e.target.value)}
            />


            <input
                type="number"
                placeholder="Price"
                className="block mb-2 p-2 text-black"
                onChange={(e) => setPrice(e.target.value)}
            />

            <input
                type="number"
                placeholder="Total Seats"
                className="block mb-2 p-2 text-black"
                onChange={(e) => setTotalSeats(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="bg-blue-500 px-4 py-2 rounded"
            >
                Create
            </button>
        </div>
    );
}

export default CreateEvent;