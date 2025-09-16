import React from "react";
import Aside from "../components/Aside/Aside";
import Header from "../components/Header/Header";
import "./layout.css"

const Layout = ({ active, headerText, menuItems, children }) => {
    return (
        <div className="layout">
            {/* Sidebar with dynamic menu */}
            <Aside active={active} menuItems={menuItems} />

            {/* Right side: header, search, and main content */}
            <div className="right-side">
                <Header text={headerText} />
                <main className="main">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
