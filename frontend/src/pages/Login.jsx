import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
        w-full max-w-md
        bg-gradient-to-br from-[#111827] to-[#0b1220]
        border border-gray-800
        p-8 rounded-2xl
        space-y-5
        shadow-xl
        "
      >
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#020617] border border-gray-800 focus:ring-2 focus:ring-blue-500"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
