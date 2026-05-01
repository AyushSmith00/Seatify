import {BrowserRouter, Router, Route, Routes} from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import CreateEvent from "./pages/CreateEvent.jsx"
import Navbar from "./components/Navbar.jsx"


function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
