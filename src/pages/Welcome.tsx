import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/images/welcome.png';
import Button from '../components/Button';
import ScreenWrapper from '../components/ScreenWrapper';

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-svh justify-between pb-10 px-5 overflow-hidden">
                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.05, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex items-center justify-center pt-16"
                >
                    <img
                        src={welcomeImage}
                        alt="Welcome"
                        className="w-52 aspect-square object-contain drop-shadow-2xl"
                    />
                </motion.div>

                {/* Content */}
                <div className="flex flex-col items-center text-center mb-8 px-2">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                    >
                        <h1
                            className="text-5xl font-outfit font-black tracking-tight mb-2"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Awaza
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="text-[15px] font-medium leading-relaxed"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Experience the next generation of social connection.
                    </motion.p>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-col gap-4 w-full"
                >
                    <Button
                        title="Get Started"
                        onClick={() => navigate('/signup')}
                        hasShadow={true}
                    />

                    <div className="flex flex-row justify-center items-center gap-1.5">
                        <span
                            className="text-[14px] font-medium"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Have an account?
                        </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[14px] font-bold active-scale transition-opacity hover:opacity-70"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Sign In
                        </button>
                    </div>
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default Welcome;
