import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { updateUsername } from '../utils/accountSetting';

const UpdateUsername: React.FC = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [loading, setLoading] = useState(false);

    const isValidUsername = (str: string) => /^[a-z0-9_]{3,20}$/.test(str);
    const hasChanged = username.trim().toLowerCase() !== (user?.username || '');
    const isInvalid = username.trim() !== '' && !isValidUsername(username.trim().toLowerCase());

    const handleSave = async () => {
        const trimmed = username.trim().toLowerCase();
        if (!trimmed) { alert('Username cannot be empty'); return; }
        if (trimmed === user?.username) { navigate(-1); return; }
        if (!isValidUsername(trimmed)) { alert('3-20 chars, lowercase letters, numbers, and underscores only.'); return; }
        setLoading(true);
        try {
            await updateUsername(trimmed);
            if (login && user) login({ ...user, username: trimmed });
            alert('Username updated!');
            navigate(-1);
        } catch (error: any) { alert(error.message || 'Failed to update username.'); }
        finally { setLoading(false); }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header
                    title="Username"
                    rightElement={
                        <button
                            onClick={handleSave}
                            disabled={loading || !hasChanged || isInvalid}
                            className="text-[15px] font-bold px-1 transition-all"
                            style={{
                                color: 'var(--color-primary)',
                                opacity: (loading || !hasChanged || isInvalid) ? 0.3 : 1,
                            }}
                        >
                            {loading ? (
                                <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
                            ) : 'Save'}
                        </button>
                    }
                />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-5 pt-6"
                >
                    <div className="flex flex-col gap-1.5 mb-3">
                        <label className="text-[12px] font-bold ml-1 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                            Username
                        </label>
                        <div
                            className="flex flex-row items-center h-12 rounded-xl border-2 px-4 transition-all"
                            style={{
                                borderColor: isInvalid ? 'var(--color-error)' : 'var(--color-border)',
                                backgroundColor: isInvalid ? 'color-mix(in srgb, var(--color-error) 4%, transparent)' : 'var(--color-input-bg)',
                            }}
                        >
                            <span className="text-[16px] font-bold mr-0.5" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                                className="flex-1 h-full bg-transparent outline-none text-[16px] font-bold lowercase"
                                style={{ color: 'var(--color-text)', caretColor: 'var(--color-primary)' }}
                                autoFocus
                            />
                        </div>
                    </div>

                    <p className="text-[12px] font-medium px-1 leading-relaxed" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
                        3-20 characters: lowercase letters, numbers, and underscores only.
                    </p>

                    {isInvalid && (
                        <motion.p
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[12px] font-bold mt-3 px-1"
                            style={{ color: 'var(--color-error)' }}
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
