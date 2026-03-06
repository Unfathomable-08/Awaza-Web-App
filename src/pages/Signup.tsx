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
            setError('Please fill all the fields!');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await signUp(trimmedEmail, password, trimmedUsername);
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <Header title="Sign Up" showBackButton={true} />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col flex-1 px-6 pt-10 gap-5"
            >
                {/* Header Text */}
                <div className="flex flex-col gap-1.5 mb-6">
                    <span className="text-3xl font-bold" style={{ color: colors.text }}>
                        Let's
                    </span>
                    <h1 className="text-4xl font-extrabold" style={{ color: colors.primary }}>
                        Get Started
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <Input
                        icon={<User size={22} />}
                        placeholder="Full Name"
                        value={username}
                        onChange={(val) => setUsername(val)}
                    />

                    <Input
                        icon={<Mail size={22} />}
                        placeholder="Email address"
                        value={email}
                        onChange={(val) => setEmail(val)}
                        type="email"
                    />

                    <Input
                        icon={<Lock size={22} />}
                        placeholder="Password"
                        value={password}
                        onChange={(val) => setPassword(val)}
                        type="password"
                    />

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

                    <Button title="Signup" className="mt-5" loading={loading} />
                </form>

                {/* Footer */}
                <div className="flex flex-row justify-center items-center mt-auto pb-10">
                    <span className="text-sm" style={{ color: colors.text }}>
                        Already have an account?
                    </span>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold ml-1.5 hover:opacity-70 active:scale-95 transition-all text-primary"
                        style={{ color: colors.primary }}
                    >
                        Login
                    </button>
                </div>
            </motion.div>
        </ScreenWrapper>
    );
};

export default Signup;
