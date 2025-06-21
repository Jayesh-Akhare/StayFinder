import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/listings/${id}`);
        const data = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          image: data.image,
        });
      } catch (err) {
        console.error("Failed to load listing", err);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Listing updated!");
        console.log("Redirecting after update...");

        navigate("/host-dashboard");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update listing");
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      <h2>Edit Listing</h2>
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
      <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required />
      <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <button type="submit">Update Listing</button>
    </form>
  );
};

export default EditListing;
