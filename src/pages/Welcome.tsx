import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/images/welcome.png';
import Button from '../components/Button';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <ScreenWrapper bg={colors.background}>
            <div className="flex flex-col h-svh justify-evenly pb-12 px-4 overflow-hidden">
                {/* Hero Image Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.1, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex items-center justify-center pt-8 relative"
                >
                    <img
                        src={welcomeImage}
                        alt="Welcome"
                        className="w-full max-w-60 aspect-square object-contain drop-shadow-2xl relative z-10"
                    />
                </motion.div>

                {/* Content Section */}
                <div className="flex flex-col items-center text-center mb-6 px-2">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-outfit font-black tracking-tight mb-2" style={{ color: colors.primary }}>
                            Awaza
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="font-medium"
                        style={{ color: colors.text }}
                    >
                        Experience the next generation of social connection and sharing.
                    </motion.p>
                </div>

                {/* Actions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col gap-6 w-full max-w-85 mx-auto"
                >
                    <Button
                        title="Start Exploring"
                        onClick={() => navigate('/signup')}
                        hasShadow={true}
                    />

                    <div className="flex flex-row justify-center items-center gap-2 pt-2">
                        <span className="font-medium opacity-60" style={{ color: colors.text }}>
                            Have an account?
                        </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="font-bold active-scale transition-opacity hover:opacity-70"
                            style={{ color: colors.primary }}
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
