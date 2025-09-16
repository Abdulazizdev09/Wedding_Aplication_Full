import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import UserProfile from '../UserProfile/UserProfile';
import NavMenu from '../NavMenu/NavMenu';
import "./aside.css"

function Aside({ menuItems }) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[2] || '';

    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleClick = (path) => {
        if (path === '/logout') {
            logout();
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    return (
        <aside className="aside">
            <div className="navItems">
                {menuItems.map(({ path, icon, label }) => (
                    <NavMenu
                        key={path}
                        icon={icon}
                        link={label}
                        isActive={location.pathname === path}
                        onClick={() => handleClick(path)}
                    />
                ))}
            </div>

            {user && (
                <UserProfile
                    username={user.username || 'anonymous'}
                    // No avatarSrc prop since no picture
                    onClick={() => navigate('/admin')}
                />
            )}
        </aside>
    );
}

export default Aside;
