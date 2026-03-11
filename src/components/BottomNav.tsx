import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Bell, User } from 'lucide-react';
import { RiMailSendFill } from "react-icons/ri";
import { useAuth } from '../contexts/authContext';

const BottomNav: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Only show for authenticated users and not on welcome/login/signup pages
    const hideOnPaths = ['/welcome', '/login', '/signup', '/check-email'];
    if (!user || hideOnPaths.includes(location.pathname)) {
        return null;
    }

    const navItems = [
        { icon: <Home size={24} />, label: 'Home', path: '/home' },
        { icon: <RiMailSendFill size={24} />, label: 'Messages', path: '/inbox' },
        { icon: <Bell size={24} />, label: 'Notifications', path: '/notifications' },
        { icon: <User size={24} />, label: 'Account', path: `/profile/${user.username}` },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 h-16 px-6 flex items-center justify-between pointer-events-auto shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                        flex flex-col items-center justify-center gap-1
                        transition-all duration-200
                        ${isActive ? 'text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}
                    `}
                >
                    <div className="relative">
                        {item.icon}
                        {/* Placeholder for notification badges if needed later */}
                    </div>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
