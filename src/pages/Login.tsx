import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
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

        if (!trimmedEmail || !password) {
            setError('Please enter your credentials');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await signIn(trimmedEmail, password);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg={colors.background}>
            <Header transparent showBackButton={true} />

            <div className="flex flex-col flex-1 px-8 pt-4 pb-12 overflow-y-auto no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col flex-1 gap-10"
                >
                    {/* Header Section */}
                    <div className="flex flex-col pt-4">
                        <span className="text-[17px] font-medium opacity-40 mb-1" style={{ color: colors.text }}>
                            Welcome back
                        </span>
                        <h1 className="text-4xl font-outfit font-black tracking-wide" style={{ color: colors.primary }}>
                            Sign In to Awaza
                        </h1>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-5">
                            <Input
                                icon={<Mail color={colors.text} />}
                                placeholder="Email Address"
                                type="email"
                                value={email}
                                onChange={(val) => setEmail(val)}
                                required
                            />

                            <div className="flex flex-col gap-3">
                                <Input
                                    icon={<Lock color={colors.text} />}
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(val) => setPassword(val)}
                                    required
                                />
                                <div className="self-end px-1">
                                    <button
                                        type="button"
                                        className="text-[14px] font-bold opacity-60 active-scale hover:opacity-100 transition-opacity"
                                        style={{ color: colors.text }}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-error/5 border border-error/10"
                            >
                                <p className="text-[14px] font-bold text-center" style={{ color: colors.error }}>
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <div className="pt-4">
                            <Button
                                title="Sign In"
                                loading={loading}
                                hasShadow={true}
                            />
                        </div>
                    </form>

                    {/* Footer Section */}
                    <div className="mt-auto flex flex-col items-center gap-6">
                        <div className="flex flex-row items-center gap-2">
                            <span className="font-medium opacity-60" style={{ color: colors.text }}>
                                New to Awaza?
                            </span>
                            <button
                                onClick={() => navigate('/signup')}
                                className="font-bold active-scale transition-opacity hover:opacity-70"
                                style={{ color: colors.primary }}
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
