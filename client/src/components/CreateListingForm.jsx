import { useState } from "react";

const CreateListingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Create Listing</h2>
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required /><br />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required /><br />
      <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required /><br />
      <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required /><br />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required /><br />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateListingForm;
