import { useState } from "react";
import { Link } from "react-router-dom";
import './AuthForm.css';


const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = type === "register"
      ? formData
      : { email: formData.email, password: formData.password };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {type === "register" && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">{type === "login" ? "Login" : "Register"}</button>

      <p style={{ marginTop: "10px" }}>
        {type === "login" ? (
          <>Don't have an account? <Link to="/register">Register</Link></>
        ) : (
          <>Already have an account? <Link to="/login">Login</Link></>
        )}
      </p>
    </form>
  );
};

export default AuthForm;
