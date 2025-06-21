import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        alert("Login successful!");

        if (onLogin) onLogin();  // <-- Notify App about login success

        navigate("/"); // Redirect to homepage or dashboard
      } else {
        alert(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error", err);
      alert("Something went wrong");
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;
