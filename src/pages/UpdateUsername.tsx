/**
 * @file UpdateUsername.tsx
 * @description Allows the user to change their unique @username.
 *
 * Features:
 *  - Real-time regex validation (3-20 lowercase alphanumeric + underscores)
 *  - Save button disables automatically if unchanged or invalid
 *  - Visual error state on the input field when invalid
 */

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { updateUsername } from '../utils/accountSetting';

/**
 * UpdateUsername
 *
 * The input is pre-populated with the user's current username and auto-focused.
 * Focus/error states are driven purely by Tailwind classes.
 */
const UpdateUsername: React.FC = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    
    // ── Form state ───────────────────────────────────────────────────────
    const [username, setUsername] = useState(user?.username || '');
    const [loading,  setLoading]  = useState(false);

    /** Regex constraint: 3 to 20 chars, lowercase, numbers, underscores only */
    const isValidUsername = (str: string) => /^[a-z0-9_]{3,20}$/.test(str);
    
    // ── Derived state ────────────────────────────────────────────────────
    const trimmed    = username.trim().toLowerCase();
    const hasChanged = trimmed !== (user?.username || '');
    const isInvalid  = trimmed !== '' && !isValidUsername(trimmed);

    /** Validate and submit the name change */
    const handleSave = async () => {
        if (!trimmed) { alert('Username cannot be empty'); return; }
        if (!hasChanged) { navigate(-1); return; }
        if (!isValidUsername(trimmed)) { alert('3-20 chars, lowercase letters, numbers, and underscores only.'); return; }
        
        setLoading(true);
        try {
            await updateUsername(trimmed);
            // Patch the auth context so the rest of the app reflects the change
            if (login && user) login({ ...user, username: trimmed });
            alert('Username updated!');
            navigate(-1);
        } catch (error: any) { 
            alert(error.message || 'Failed to update username.'); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                {/* ── App header with contextual Save button ── */}
                <Header
                    title="Username"
                    rightElement={
                        <button
                            onClick={handleSave}
                            disabled={loading || !hasChanged || isInvalid}
                            className={`
                                text-[15px] font-bold px-1 transition-all text-primary
                                ${(loading || !hasChanged || isInvalid) ? 'opacity-30' : 'opacity-100'}
                            `}
                        >
                            {loading ? (
                                <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin border-primary" />
                            ) : 'Save'}
                        </button>
                    }
                />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-5 pt-6"
                >
                    {/* ── Input field ── */}
                    <div className="flex flex-col gap-1.5 mb-3">
                        <label className="text-[12px] font-bold ml-1 uppercase tracking-wide text-muted">
                            Username
                        </label>
                        
                        <div
                            className={`
                                flex flex-row items-center h-12 rounded-xl border-2 px-4 transition-all
                                ${isInvalid 
                                    ? 'border-error bg-error-5 focus-within:border-error-15' 
                                    : 'border-app bg-input focus-within:border-primary-30'
                                }
                            `}
                        >
                            <span className="text-[16px] font-bold mr-0.5 text-muted opacity-50">@</span>
                            
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                                autoFocus
                                className="
                                    flex-1 h-full bg-transparent outline-none
                                    text-[16px] font-bold lowercase
                                    text-app caret-primary
                                "
                            />
                        </div>
                    </div>

                    {/* ── Help / Error text ── */}
                    <p className="text-[12px] font-medium px-1 leading-relaxed text-muted opacity-60">
                        3-20 characters: lowercase letters, numbers, and underscores only.
                    </p>

                    {isInvalid && (
                        <motion.p
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[12px] font-bold mt-3 px-1 text-error"
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
