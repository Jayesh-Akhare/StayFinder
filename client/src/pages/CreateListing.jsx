import { useState } from "react";
import { useNavigate } from "react-router-dom";


const CreateListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
    lat: "",       
    lng: "", 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("You must be logged in");

  try {
    // ✅ Step 1: Get lat/lng from address
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${formData.location}`);
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return alert("Could not find location. Please enter a valid address.");
    }

    const { lat, lon } = geoData[0]; // get first match

    // ✅ Step 2: Add to formData
    const completeData = {
      ...formData,
      lat: parseFloat(lat),
      lng: parseFloat(lon),
    };

    // ✅ Step 3: Submit to your backend
    const res = await fetch("http://localhost:5000/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(completeData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Listing created!");
      navigate("/host-dashboard");
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error("Error creating listing", err);
    alert("Something went wrong");
  }
};


  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
  <h2>Create a Listing</h2>
  <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
  <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
  <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required />
  <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required />
  <input
  name="lat"
  value={formData.lat}
  onChange={handleChange}
  placeholder="Latitude"
  type="number"
  step="any"
  required
/>
<input
  name="lng"
  value={formData.lng}
  onChange={handleChange}
  placeholder="Longitude"
  type="number"
  step="any"
  required
/>

  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
  <button type="submit">Create</button>
    </form>
  );
};

export default CreateListing;
