import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HostDashboard = () => {
  const [myListings, setMyListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyListings();
  }, []);

 const fetchMyListings = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token); 
    const res = await fetch("http://localhost:5000/api/listings/my-listings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    console.log("Fetched listings:", data);

    // ✅ Check if data is an array
    if (Array.isArray(data)) {
      setMyListings(data);
    } 
    // ✅ Check if data.listings is an array (if backend wraps listings in an object)
    else if (Array.isArray(data.listings)) {
      setMyListings(data.listings);
    } 
    // ❌ Handle unexpected response
    else {
      console.warn("Unexpected API response:", data);
      setMyListings([]); // fallback to empty array to avoid crash
    }
  } catch (err) {
    console.error("Failed to fetch listings", err);
    setMyListings([]); // fallback to avoid crashing the UI
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMyListings(myListings.filter((listing) => listing._id !== id));
        alert("Listing deleted successfully");
      } else {
        alert("Failed to delete listing");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`);
  };

  return (
    <div>
      <h2>Your Listings</h2>
      {myListings.length === 0 ? (
  <p>You haven’t posted any listings yet.</p>
) : (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
    {myListings.map((listing) => (
      <div key={listing._id} style={{ border: "1px solid #ccc", padding: "10px", width: "250px" }}>
        <img
          src={listing.image || "https://via.placeholder.com/250x150?text=No+Image"}
          alt={listing.title}
          style={{ width: "100%", height: "150px", objectFit: "cover"}}
        />
        <h3>{listing.title}</h3>
        <p>{listing.location}</p>
        <p>₹{listing.price}/night</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={() => handleEdit(listing._id)} style={{
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  }}>Edit</button>
          <button onClick={() => handleDelete(listing._id)} style={{background: "red",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer", }}>
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default HostDashboard;
