import { useEffect, useState } from "react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== id));
        alert("Booking cancelled.");
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Error cancelling booking", err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "16px", borderRadius: "8px" }}>
            <img
              src={booking.listing?.image}
              alt={booking.listing?.title}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "6px" }}
            />
            <h3>{booking.listing?.title}</h3>
            <p>{booking.listing?.location}</p>
            <p>₹{booking.listing?.price}/night</p>
            <p>
              <strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()} |{" "}
              <strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <button onClick={() => handleCancel(booking._id)} style={{ background: "red", color: "white", marginTop: "10px" }}>
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
