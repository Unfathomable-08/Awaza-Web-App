import { ChevronRight, LogOut, PersonStanding, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';

const AccountSetting: React.FC = () => {
    const navigate = useNavigate();
    const { user, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
        {
            title: 'Edit Profile',
            icon: <User size={22} />,
            path: '/update-profile',
            color: colors.text
        },
        {
            title: 'Change Username',
            icon: <PersonStanding size={22} />, // Close enough to at-outline if not available
            path: '/update-username',
            color: colors.text
        },
    ];

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-full">
                <Header title="Account Settings" />

                <div className="flex-1 px-6 pt-10">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-12 gap-3">
                        <Avatar uri={user?.avatar} size={100} rounded={34} />
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-black tracking-tight" style={{ color: colors.text }}>
                                {user?.name || "Your Name"}
                            </h2>
                            <p className="text-base font-semibold opacity-50" style={{ color: colors.textLight }}>
                                @{user?.username || "username"}
                            </p>
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="flex flex-col gap-2">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(option.path)}
                                className="flex flex-row items-center justify-between py-5 border-b border-gray-50 active:bg-gray-50/50 transition-all outline-none group"
                            >
                                <div className="flex flex-row items-center gap-4">
                                    <div
                                        className="p-2.5 rounded-xl bg-gray-50 group-active:bg-primary/10 transition-colors"
                                        style={{ color: option.color }}
                                    >
                                        {option.icon}
                                    </div>
                                    <span className="text-[17px] font-bold" style={{ color: colors.text }}>
                                        {option.title}
                                    </span>
                                </div>
                                <ChevronRight size={20} className="text-gray-300 group-active:text-primary transition-colors" />
                            </button>
                        ))}

                        {/* Logout Option */}
                        <button
                            onClick={handleLogout}
                            className="flex flex-row items-center justify-between py-5 active:bg-rose-50/50 transition-all outline-none group mt-4"
                        >
                            <div className="flex flex-row items-center gap-4 text-rose-500">
                                <div className="p-2.5 rounded-xl bg-rose-50 transition-colors">
                                    <LogOut size={22} />
                                </div>
                                <span className="text-[17px] font-bold">Log Out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default AccountSetting;
