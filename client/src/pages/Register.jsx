import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login"); // 🔁 Redirect to login page
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error("Register error", err);
      alert("Something went wrong");
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;
