import MapView from "../components/MapView";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!listing || !listing.location?.coordinates) return;

    const [lng, lat] = listing.location.coordinates;

    fetch(`http://localhost:5000/api/listings/nearby?lng=${lng}&lat=${lat}`)
      .then((res) => res.json())
      .then(setNearby)
      .catch(console.error);
  }, [listing]);

  const handleBook = async () => {
    if (!token) return alert("Please log in to book.");
    if (!checkIn || !checkOut) return alert("Please select check-in and check-out dates.");

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: id,
          checkIn,
          checkOut,
        }),
      });

      const result = await res.json();
      if (res.ok) alert("✅ Booking successful!");
      else alert(result.error || "Booking failed.");
    } catch (err) {
      console.error("Booking error", err);
      alert("Something went wrong");
    }
  };

  const handleMockPayment = async () => {
    if (!token) return alert("Please log in to book.");
    const checkIn = prompt("Enter check-in date (YYYY-MM-DD):");
    const checkOut = prompt("Enter check-out date (YYYY-MM-DD):");
    if (!checkIn || !checkOut) return alert("Please enter both dates.");

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listing._id,
          checkIn,
          checkOut,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking successful!");
        window.location.href = "/my-bookings";
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error", err);
      alert("Something went wrong");
    }
  };

  const submitReview = async () => {
    if (!reviewRating || !reviewComment) return alert("Please provide both rating and comment.");

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Review submitted!");
        setListing(data.listing);
        setReviewRating(0);
        setReviewComment("");
      } else {
        alert(data.error || "Review failed");
      }
    } catch (err) {
      console.error("Review error", err);
      alert("Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listing) return <p>No listing found.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <img
        src={listing.image}
        alt={listing.title}
        style={{ width: "100%", height: "400px", objectFit: "cover" }}
      />
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p><strong>Location:</strong> {listing.location?.address || "Unknown"}</p>
      <p><strong>Price:</strong> ₹{listing.price}/night</p>
      <MapView lat={listing.lat} lng={listing.lng} />

      {/* Booking section */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label>
          Check-in:{" "}
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </label>
        <label>
          Check-out:{" "}
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </label>
        <button onClick={handleBook}>Book Now</button>
      </div>

      <button
        onClick={handleMockPayment}
        style={{ marginTop: "20px", padding: "10px" }}
      >
        Pay & Book Now
      </button>

      {/* Nearby Listings */}
      {nearby.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>Similar Stays Nearby</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {nearby.map((item) => (
              <div key={item._id} style={{ border: "1px solid #ccc", padding: "10px", width: "250px" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                <h4>{item.title}</h4>
                <p>{item.location?.address || "Unknown location"}</p>
                <p>₹{item.price}/night</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div style={{ marginTop: "40px" }}>
        <h3>
          Reviews ({listing.reviews?.length || 0}) - Avg: {listing.averageRating?.toFixed(1) || 0} ⭐
        </h3>
        {listing.reviews?.length > 0 ? (
          listing.reviews.map((r) => (
            <div key={r._id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <strong>{r.name}</strong> - {r.rating}⭐
              <p>{r.comment}</p>
              {r.reply && <p style={{ color: "green" }}>Host Reply: {r.reply}</p>}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Submit Review */}
      {token && (
        <div style={{ marginTop: "20px" }}>
          <h4>Leave a Review</h4>
          <textarea
            placeholder="Your review..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            style={{ width: "100%", minHeight: "80px", marginBottom: "10px" }}
          />
          <br />
          <input
            type="number"
            min="1"
            max="5"
            value={reviewRating}
            onChange={(e) => setReviewRating(Number(e.target.value))}
            placeholder="Rating (1-5)"
            style={{ width: "100px", marginRight: "10px" }}
          />
          <button onClick={submitReview}>Submit Review</button>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
