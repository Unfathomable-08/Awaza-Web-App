import { motion } from 'framer-motion';
import { Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { signUp } from '../utils/auth';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        if (!trimmedUsername || !trimmedEmail || !password) {
            setError('Please fill all the fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await signUp(trimmedEmail, password, trimmedUsername);
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Account creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg={colors.background}>
            <Header transparent showBackButton={true} />

            <div className="flex flex-col flex-1 px-8 pt-4 pb-12 overflow-y-auto no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col flex-1 gap-10"
                >
                    {/* Header Section */}
                    <div className="flex flex-col pt-4">
                        <span className="text-[17px] font-medium opacity-40 mb-1" style={{ color: colors.text }}>
                            Join us today
                        </span>
                        <h1 className="text-4xl font-outfit font-black tracking-wide" style={{ color: colors.primary }}>
                            Create New Account
                        </h1>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-5">
                            <Input
                                icon={<User color={colors.text} />}
                                placeholder="Full Name"
                                value={username}
                                onChange={(val) => setUsername(val)}
                                required
                            />

                            <Input
                                icon={<Mail color={colors.text} />}
                                placeholder="Email Address"
                                value={email}
                                onChange={(val) => setEmail(val)}
                                type="email"
                                required
                            />

                            <Input
                                icon={<Lock color={colors.text} />}
                                placeholder="Password"
                                value={password}
                                onChange={(val) => setPassword(val)}
                                type="password"
                                required
                            />
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
                                title="Sign Up"
                                loading={loading}
                                hasShadow={true}
                            />
                        </div>
                    </form>

                    {/* Footer Section */}
                    <div className="mt-auto flex flex-col items-center gap-6">
                        <div className="flex flex-row items-center gap-2">
                            <span className="font-medium opacity-60" style={{ color: colors.text }}>
                                Already a member?
                            </span>
                            <button
                                onClick={() => navigate('/login')}
                                className="font-bold active-scale transition-opacity hover:opacity-70"
                                style={{ color: colors.primary }}
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
