import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { updateUsername } from '../utils/accountSetting';

const UpdateUsername: React.FC = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [loading, setLoading] = useState(false);

    const isValidUsername = (str: string) => {
        return /^[a-z0-9_]{3,20}$/.test(str);
    };

    const hasChanged = username.trim().toLowerCase() !== (user?.username || "");
    const isInvalid = username.trim() !== '' && !isValidUsername(username.trim().toLowerCase());

    const handleSave = async () => {
        const trimmed = username.trim().toLowerCase();

        if (!trimmed) {
            alert("Username cannot be empty");
            return;
        }

        if (trimmed === user?.username) {
            navigate(-1);
            return;
        }

        if (!isValidUsername(trimmed)) {
            alert("Username must be 3-20 characters and can only contain lowercase letters, numbers, and underscores.");
            return;
        }

        setLoading(true);
        try {
            await updateUsername(trimmed);

            if (login && user) {
                login({ ...user, username: trimmed });
            }

            alert("Username updated successfully!");
            navigate(-1);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to update username. It might already be taken.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-full">
                <Header
                    title="Change Username"
                    rightElement={
                        <button
                            onClick={handleSave}
                            disabled={loading || !hasChanged || isInvalid}
                            className={`text-[17px] font-bold px-2 transition-all ${loading || !hasChanged || isInvalid ? 'opacity-30' : 'active:scale-95'
                                }`}
                            style={{ color: colors.primary }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Save'
                            )}
                        </button>
                    }
                />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-6 pt-10"
                >
                    <div className="flex flex-col gap-2 mb-2">
                        <label className="text-sm font-bold ml-1 opacity-60" style={{ color: colors.textLight }}>New Username</label>
                        <div
                            className={`flex flex-row items-center h-14 rounded-2xl border-2 px-4 transition-all ${isInvalid ? 'border-rose-500 bg-rose-50' : 'border-gray-100 bg-gray-50'
                                }`}
                        >
                            <span className="text-lg font-bold opacity-30 mr-1" style={{ color: colors.text }}>@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                                className="flex-1 h-full bg-transparent outline-none text-lg font-bold lowercase"
                                style={{ color: colors.text }}
                                autoFocus
                            />
                        </div>
                    </div>

                    <p className="text-sm font-medium opacity-50 px-1 leading-relaxed" style={{ color: colors.textLight }}>
                        Usernames can only contain lowercase letters, numbers, and underscores. 3-20 characters.
                    </p>

                    {isInvalid && (
                        <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm font-bold text-rose-500 mt-4 px-1"
                        >
                            Invalid format. Use lowercase a-z, 0-9, and _ only.
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default UpdateUsername;
