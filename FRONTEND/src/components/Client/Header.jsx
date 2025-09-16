import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import './header.css';

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout(navigate); // Pass navigate function to logout
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    {/* Logo */}
                    <div className="logo">
                        <Link to="/client" className="logo-link" onClick={closeMobileMenu}>
                            🏛️ HallBooker
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className={`nav ${isMobileMenuOpen ? 'nav-mobile-open' : ''}`}>
                        <Link 
                            to="/client" 
                            className={`nav-link ${isActiveLink('/client') ? 'nav-link-active' : ''}`}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/client/halls" 
                            className={`nav-link ${isActiveLink('/client/halls') ? 'nav-link-active' : ''}`}
                            onClick={closeMobileMenu}
                        >
                            All Halls
                        </Link>
                        {user && (
                            <Link 
                                to="/client/my-bookings" 
                                className={`nav-link ${isActiveLink('/client/my-bookings') ? 'nav-link-active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                My Bookings
                            </Link>
                        )}
                    </nav>

                    {/* User Authentication */}
                    <div className="auth-section">
                        {user ? (
                            <div className="user-section">
                                <span className="welcome-text">
                                    Welcome, {user.name || user.username || user.firstName || user.first_name || 'User'}
                                </span>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="login-btn" onClick={closeMobileMenu}>
                                    Login
                                </Link>
                                <Link to="/register" className="register-btn" onClick={closeMobileMenu}>
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="mobile-menu-btn">
                        <button 
                            className={`hamburger ${isMobileMenuOpen ? 'hamburger-active' : ''}`}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
                )}
            </div>
        </header>
    );
};

export default Header;