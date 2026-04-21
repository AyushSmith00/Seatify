import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="flex gap-4 p-4 bg-gray-800">
            <Link to="/">Home</Link>
            <Link to="/login">login</Link>
            <Link to="/register">register</Link>
        </div>
    )
}

export default Navbar;