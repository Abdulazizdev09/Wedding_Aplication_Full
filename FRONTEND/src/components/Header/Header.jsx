import React from "react";

const Header = ({ text }) => {
    return (
        <header
            style={{

                padding: "16px 24px",
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fff",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "red",
                userSelect: "none",
            }}
        >
            {text}
        </header>
    );
};

export default Header;
