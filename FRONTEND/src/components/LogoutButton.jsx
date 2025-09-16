import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function LogoutButton() {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate); // Pass navigate function to logout
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: "8px 16px",
                backgroundColor: "#e0245e",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
            }}
        >
            Logout
        </button>
    );
}