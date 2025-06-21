import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({});
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const [userRes, listingsRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/listings/my-listings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/bookings/my-bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = await userRes.json();
        const listingsData = await listingsRes.json();
        const bookingsData = await bookingsRes.json();

        setUser(userData);
        setListings(listingsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>

      <h3>Your Listings</h3>
      <ul>
        {listings.map((l) => (
          <li key={l._id}>{l.title} - ₹{l.price}/night</li>
        ))}
      </ul>

      <h3>Your Bookings</h3>
      <ul>
        {bookings.map((b) => (
          <li key={b._id}>
            {b.listing?.title} | {b.checkIn} → {b.checkOut}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
