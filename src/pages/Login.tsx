import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { signIn } from '../utils/auth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) { setError('Please enter your credentials'); return; }
        setLoading(true); setError(null);
        try { await signIn(trimmedEmail, password); }
        catch (err: any) { setError(err.message || 'Authentication failed'); }
        finally { setLoading(false); }
    };

    return (
        <ScreenWrapper>
            <Header transparent showBackButton={true} />

            <div className="flex flex-col flex-1 px-6 pt-2 pb-10 overflow-y-auto no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col flex-1 gap-8"
                >
                    {/* Title */}
                    <div className="flex flex-col pt-2">
                        <span
                            className="text-[14px] font-medium mb-1"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Welcome back
                        </span>
                        <h1
                            className="text-[32px] font-outfit font-black tracking-tight leading-tight"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Sign In
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col gap-3">
                            <Input
                                icon={<Mail />}
                                placeholder="Email address"
                                type="email"
                                value={email}
                                onChange={(val) => setEmail(val)}
                                required
                            />
                            <div className="flex flex-col gap-2">
                                <Input
                                    icon={<Lock />}
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(val) => setPassword(val)}
                                    required
                                />
                                <div className="self-end">
                                    <button
                                        type="button"
                                        className="text-[13px] font-semibold transition-opacity hover:opacity-60"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-xl border"
                                style={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-error) 5%, transparent)',
                                    borderColor: 'color-mix(in srgb, var(--color-error) 15%, transparent)',
                                }}
                            >
                                <p
                                    className="text-[13px] font-semibold text-center"
                                    style={{ color: 'var(--color-error)' }}
                                >
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <Button title="Sign In" loading={loading} hasShadow={true} />
                    </form>

                    {/* Footer */}
                    <div className="mt-auto flex flex-col items-center">
                        <div className="flex flex-row items-center gap-1.5">
                            <span
                                className="text-[14px] font-medium"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                New to Awaza?
                            </span>
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-[14px] font-bold active-scale transition-opacity hover:opacity-70"
                                style={{ color: 'var(--color-primary)' }}
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
