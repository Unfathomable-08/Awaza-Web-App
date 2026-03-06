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
            setError('Please fill in both email and password');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await signIn(trimmedEmail, password);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <Header title="Login" showBackButton={true} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col flex-1 px-6 pt-10 gap-5"
            >
                {/* Header Text */}
                <div className="flex flex-col gap-1.5 mb-8">
                    <span className="text-xl font-medium" style={{ color: colors.text }}>
                        Hey there,
                    </span>
                    <h1 className="text-4xl font-extrabold" style={{ color: colors.primary }}>
                        Welcome Back
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <Input
                        icon={<Mail size={24} color={colors.textLight} />}
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(val) => setEmail(val)}
                        required
                    />
                    <div className="flex flex-col gap-3">
                        <Input
                            icon={<Lock size={24} color={colors.textLight} />}
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(val) => setPassword(val)}
                            required
                        />
                        <div className="self-end px-2">
                            <button
                                type="button"
                                className="text-sm font-semibold hover:opacity-70 active:scale-95 transition-all text-primary"
                                style={{ color: colors.primary }}
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium text-center"
                            style={{ color: colors.error }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button title="Login" loading={loading} className="mt-4" />
                </form>

                {/* Footer */}
                <div className="flex flex-row justify-center items-center mt-auto pb-10">
                    <span className="text-sm" style={{ color: colors.text }}>
                        Don't have an account?
                    </span>
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-sm font-bold ml-1.5 hover:opacity-70 active:scale-95 transition-all"
                        style={{ color: colors.primary }}
                    >
                        Sign Up
                    </button>
                </div>
            </motion.div>
        </ScreenWrapper>
    );
};

export default Login;
