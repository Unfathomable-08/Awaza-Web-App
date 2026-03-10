/**
 * @file Signup.tsx
 * @description Registration screen for new users.
 *
 * Collects name, email, and password.  Performs light client-side validation
 * (all fields required, password ≥ 6 chars) before calling `signUp`.
 */

import { motion } from 'framer-motion';
import { Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { signUp } from '../utils/auth';

/**
 * Signup
 *
 * Layout mirrors Login for visual consistency.  After successful registration
 * the auth context navigates the user to email verification.
 */
const Signup: React.FC = () => {
    const navigate = useNavigate();

    // ── Form state ───────────────────────────────────────────────────────
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /** Validates inputs then calls the sign-up utility */
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const usernameTrimmed = username.trim();
        const emailTrimmed = email.trim();

        if (!usernameTrimmed || !emailTrimmed || !password) { setError('Please fill all the fields'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

        setLoading(true);
        setError(null);

        try {
            await signUp(emailTrimmed, password, usernameTrimmed);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Account creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <Header transparent showBackButton />

            <div className="flex flex-col flex-1 px-6 pt-2 pb-10 overflow-y-auto no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col flex-1 gap-8"
                >
                    {/* ── Page heading ── */}
                    <div className="flex flex-col pt-2">
                        <span className="text-[14px] font-medium mb-1 text-muted">
                            Join us today
                        </span>
                        <h1 className="text-[32px] font-outfit font-black tracking-tight leading-tight text-primary">
                            Create Account
                        </h1>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col gap-3">
                            <Input icon={<User />} placeholder="Full name" value={username} onChange={setUsername} required />
                            <Input icon={<Mail />} placeholder="Email address" value={email} onChange={setEmail} type="email" required />
                            <Input icon={<Lock />} placeholder="Password" value={password} onChange={setPassword} type="password" required />
                        </div>

                        {/* Error alert */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-xl border bg-error-5 border-error-15"
                            >
                                <p className="text-[13px] font-semibold text-center text-error">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <Button title="Create Account" loading={loading} hasShadow />
                    </form>

                    {/* ── Footer link ── */}
                    <div className="mt-auto flex flex-col items-center">
                        <div className="flex flex-row items-center gap-1.5">
                            <span className="text-[14px] font-medium text-muted">
                                Already a member?
                            </span>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[14px] font-bold text-primary active-scale transition-opacity hover:opacity-70"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default Signup;
