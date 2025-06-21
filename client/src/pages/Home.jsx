import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import the CSS file

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    // Fetch all listings
    fetch("http://localhost:5000/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setFilteredListings(data);
      })
      .catch((err) => console.error("Error fetching listings", err));

    // Fetch recommended listings from recent search filters
    const recentFilters = JSON.parse(localStorage.getItem("recentSearchFilters"));
    if (recentFilters && Object.values(recentFilters).some((v) => v)) {
      fetch("http://localhost:5000/api/listings?location=" + recentFilters.location)
        .then((res) => res.json())
        .then((data) => setRecommended(data))
        .catch((err) => console.error("Failed to load recommendations", err));
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    let filtered = listings;

    if (filters.location) {
      filtered = filtered.filter((l) =>
        l.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter((l) => l.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((l) => l.price <= parseInt(filters.maxPrice));
    }

    setFilteredListings(filtered);

    // Save current filters to localStorage
    localStorage.setItem("recentSearchFilters", JSON.stringify(filters));
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Your Perfect Stay</h1>
        <p>Book unique places to stay and experience local life.</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="filter-input small-input"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="filter-input small-input"
        />
        <button onClick={applyFilters} className="filter-button">
          Apply Filters
        </button>
      </div>

      {/* Listings */}
      <h2 style={{ marginBottom: "12px" }}>All Listings</h2>
      <div className="listings-grid">
        {filteredListings.map((listing) => (
          <div key={listing._id} className="listing-card">
            <Link to={`/listing/${listing._id}`} className="listing-link">
              <img src={listing.image} alt={listing.title} className="listing-image" />
              <h3 className="listing-title">{listing.title}</h3>
              <p className="listing-location">{listing.location}</p>
              <p className="listing-price">₹{listing.price}/night</p>
            </Link>
            <button
              onClick={() => alert("Mock booking flow triggered!")}
              className="book-button"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <>
          <h2 style={{ margin: "40px 0 12px" }}>You Might Also Like</h2>
          <div className="listings-grid">
            {recommended.map((listing) => (
              <div key={listing._id} className="listing-card">
                <Link to={`/listing/${listing._id}`} className="listing-link">
                  <img src={listing.image} alt={listing.title} className="listing-image" />
                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-location">{listing.location}</p>
                  <p className="listing-price">₹{listing.price}/night</p>
                </Link>
                <button
                  onClick={() => alert("Mock booking flow triggered!")}
                  className="book-button"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
