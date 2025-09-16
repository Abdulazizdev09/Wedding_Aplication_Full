import React from 'react';
import "./navmenu.css";

function NavMenu({ icon, link, isActive, onClick }) {
    return (
        <div
            className={`nav-menu ${isActive ? "active" : ""}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div>{icon}</div>
            <div className='nav-menu-text'>{link}</div>
        </div>
    );
}

export default NavMenu;
