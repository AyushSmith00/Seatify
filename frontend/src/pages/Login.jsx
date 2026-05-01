import { useState } from "react";
import API from "../services/api.js";
import {useNavigate} from "react-router-dom"

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            const res = await API.post("/auth/login", form)
            
            console.log(res.data)

            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Login Successfully")

            navigate("/")

        } catch (error) {
            console.log(error.response?.data);
            alert("Login Failed")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 bg-gray-800 p-6 rounded text-white w-80"
            >
                <h2 className="text-xl font-bold">Login</h2>
                
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

                <button className="bg-green-500 p-2 rounded">Login</button>
            </form>
        </div>
    )
}

export default Login;
