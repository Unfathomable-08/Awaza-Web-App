/**
 * @file AccountSetting.tsx
 * @description User account settings page.
 *
 * Shows the user's profile summary and a list of navigation options
 * (Edit Profile, Change Username) plus a destructive log-out action.
 */

import { ChevronRight, LogOut, PersonStanding, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';

/** A single entry in the settings option list */
interface SettingOption {
    title: string;
    icon: React.ReactNode;
    path: string;
}

/**
 * AccountSetting
 *
 * Renders a profile card at the top followed by a divided option list.
 * The log-out button is separated visually and styled in the error colour.
 */
const AccountSetting: React.FC = () => {
    const navigate = useNavigate();
    const { user, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-svh">
                <div className="spinner" />
            </div>
        );
    }

    /** Confirm then log out and redirect to welcome */
    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            await logout?.();
            navigate('/welcome');
        }
    };

    const options: SettingOption[] = [
        { title: 'Edit Profile',     icon: <User size={20} />,          path: '/update-profile'  },
        { title: 'Change Username',  icon: <PersonStanding size={20} />, path: '/update-username' },
    ];

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header title="Settings" />

                <div className="px-5 pt-8">
                    {/* ── Profile summary card ── */}
                    <div className="flex flex-col items-center mb-8 gap-2.5">
                        <Avatar uri={user?.avatar} size={80} />

                        <div className="flex flex-col items-center">
                            <h2 className="text-[20px] font-black tracking-tight text-app">
                                {user?.name || 'Your Name'}
                            </h2>
                            <p className="text-[13px] font-semibold text-muted">
                                @{user?.username || 'username'}
                            </p>
                        </div>
                    </div>

                    {/* ── Option list ── */}
                    <div className="flex flex-col">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(option.path)}
                                className="
                                    flex flex-row items-center justify-between
                                    py-4 border-b border-sep
                                    active:bg-black/3 transition-all outline-none
                                "
                            >
                                <div className="flex flex-row items-center gap-3.5">
                                    {/* Icon badge */}
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-separator text-app">
                                        {option.icon}
                                    </div>
                                    <span className="text-[16px] font-semibold text-app">
                                        {option.title}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="text-muted opacity-40" />
                            </button>
                        ))}

                        {/* ── Destructive: log out ── */}
                        <button
                            onClick={handleLogout}
                            className="flex flex-row items-center gap-3.5 py-4 mt-4 active:bg-red-50/50 transition-all outline-none"
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-error-10 text-error">
                                <LogOut size={20} />
                            </div>
                            <span className="text-[16px] font-semibold text-error">
                                Log Out
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default AccountSetting;
