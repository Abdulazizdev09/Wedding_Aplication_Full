// pages/auth/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api/authApi";
import "./Register.css"; // Import the CSS file

export default function Register() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        phone_number: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await register(form);
            alert(data.message);
            navigate("/login", { replace: true }); // Use replace to prevent back button
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="name-row">
                    <input
                        name="first_name"
                        placeholder="First Name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    <input
                        name="last_name"
                        placeholder="Last Name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                />
                <input
                    name="phone_number"
                    placeholder="Phone Number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                    type="tel"
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <p className="register-link">
                Already have an account?{" "}
                <Link to="/login">
                    Sign in here
                </Link>
            </p>

            {error && <p className="register-error">{error}</p>}
        </div>
    );
}