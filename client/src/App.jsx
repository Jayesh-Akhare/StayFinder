import "leaflet/dist/leaflet.css";
import { useNavigate, BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import HostDashboard from "./pages/HostDashboard";
import EditListing from "./components/EditListing";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import "./App.css"; // import custom CSS

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="brand">StayFinder</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/create">Create Listing</Link>
              <Link to="/host-dashboard">Host Dashboard</Link>
              <Link to="/my-bookings">My Bookings</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<Register onRegister={() => setIsLoggedIn(true)} />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/host-dashboard" element={<HostDashboard />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
