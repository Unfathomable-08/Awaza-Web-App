/**
 * @file Login.tsx
 * @description Authentication screen for returning users.
 *
 * Features:
 *  - Email + password fields via the reusable `Input` component
 *  - Client-side empty-field validation before hitting the API
 *  - Animated error message block on API failure
 *  - Loading state forwarded to the `Button` spinner
 */

import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { signIn } from '../utils/auth';

/**
 * Login
 *
 * The whole form slides up from y=24 on mount.  Errors are shown in a
 * pill-shaped alert box that scales in from 0.96.
 */
const Login: React.FC = () => {
    const navigate = useNavigate();

    // ── Form state ───────────────────────────────────────────────────────
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /** Submit handler — validates then calls the sign-in utility */
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();

        // Client-side guard
        if (!trimmedEmail || !password) {
            setError('Please enter your credentials');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await signIn(trimmedEmail, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            {/* Transparent header so the page gradient shows through */}
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
                            Welcome back
                        </span>
                        <h1 className="text-[32px] font-outfit font-black tracking-tight leading-tight text-primary">
                            Sign In
                        </h1>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col gap-3">
                            <Input
                                icon={<Mail />}
                                placeholder="Email address"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                required
                            />

                            <div className="flex flex-col gap-2">
                                <Input
                                    icon={<Lock />}
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={setPassword}
                                    required
                                />

                                {/* Forgot password link */}
                                <div className="self-end">
                                    <button
                                        type="button"
                                        className="text-[13px] font-semibold text-muted transition-opacity hover:opacity-60"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
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

                        <Button title="Sign In" loading={loading} hasShadow />
                    </form>

                    {/* ── Footer link ── */}
                    <div className="mt-auto flex flex-col items-center">
                        <div className="flex flex-row items-center gap-1.5">
                            <span className="text-[14px] font-medium text-muted">
                                New to Awaza?
                            </span>
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-[14px] font-bold text-primary active-scale transition-opacity hover:opacity-70"
                            >
                                Join Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default Login;
