import { useState } from "react";
import API from "../services/api.js";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/register")
            alert("Registered Successfully");
            console.log(res.data);

        } catch (error) {
            console.error(error)
            alert("Register Failed");
        };
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 bg-gray-800 p-6 rounded text-white w-80">

                <h2 className="text-xl font-bold">Register</h2>

                <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="p-2 rounded text-black"
                />

                <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="p-2 rounded text-black"
                />

                <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="p-2 rounded text-black"
                />

                <button className="bg-blue-500 p-2 rounded">
                Register
                </button>
            </form>
        </div>
    )
}

export default Register