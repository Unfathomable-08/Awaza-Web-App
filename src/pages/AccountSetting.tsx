import { ChevronRight, LogOut, PersonStanding, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';

const AccountSetting: React.FC = () => {
    const navigate = useNavigate();
    const { user, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-dvh">
                <div className="spinner" />
            </div>
        );
    }

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            await logout?.();
            navigate('/welcome');
        }
    };

    const options = [
        { title: 'Edit Profile', icon: <User size={20} />, path: '/update-profile' },
        { title: 'Change Username', icon: <PersonStanding size={20} />, path: '/update-username' },
    ];

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header title="Settings" />

                <div className="px-5 pt-8">
                    {/* Profile Card */}
                    <div className="flex flex-col items-center mb-8 gap-2.5">
                        <Avatar uri={user?.avatar} size={80} />
                        <div className="flex flex-col items-center">
                            <h2 className="text-[20px] font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
                                {user?.name || 'Your Name'}
                            </h2>
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                                @{user?.username || 'username'}
                            </p>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(option.path)}
                                className="flex flex-row items-center justify-between py-4 border-b active:bg-black/3 transition-all outline-none group"
                                style={{ borderColor: 'var(--color-separator)' }}
                            >
                                <div className="flex flex-row items-center gap-3.5">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--color-separator)', color: 'var(--color-text)' }}
                                    >
                                        {option.icon}
                                    </div>
                                    <span className="text-[16px] font-semibold" style={{ color: 'var(--color-text)' }}>
                                        {option.title}
                                    </span>
                                </div>
                                <ChevronRight size={18} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />
                            </button>
                        ))}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex flex-row items-center gap-3.5 py-4 mt-4 active:bg-red-50/50 transition-all outline-none"
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)', color: 'var(--color-error)' }}>
                                <LogOut size={20} />
                            </div>
                            <span className="text-[16px] font-semibold" style={{ color: 'var(--color-error)' }}>
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
