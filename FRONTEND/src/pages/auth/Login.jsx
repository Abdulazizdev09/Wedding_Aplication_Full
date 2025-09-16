// pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { login } from "../../api/authApi";
import "./Login.css"

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await login(credentials.username, credentials.password);

      // Store auth data
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth(user, token);

      // Handle redirect logic based on user role and saved redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      
      if (user.role === "admin") {
        navigate("/admin/halls", { replace: true });
      } else if (user.role === "hall_owner") {
        navigate("/owner/halls", { replace: true });
      } else if (user.role === "client") {
        // For clients, check if there's a saved redirect path
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath, { replace: true });
        } else {
          navigate("/client", { replace: true }); // Default to client home
        }
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
          autoFocus
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 15, textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Register here
        </Link>
      </p>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}