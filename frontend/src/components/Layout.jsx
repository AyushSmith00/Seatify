import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">

      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-[#020617]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold cursor-pointer"
          >
            Seatify
          </h1>

          <div className="flex items-center gap-3">

            {user?.role === "ORGANIZER" && (
              <button
                onClick={() => navigate("/create-event")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
              >
                + Create
              </button>
            )}

            {user?.role === "CUSTOMER" && (
              <button
                onClick={() => navigate("/my-bookings")}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
              >
                Bookings
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
