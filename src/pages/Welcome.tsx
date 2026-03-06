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
            <div className="flex flex-col min-h-full justify-between pb-12 px-6">
                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex-1 flex items-center justify-center pt-10"
                >
                    <img
                        src={welcomeImage}
                        alt="Welcome"
                        className="w-full max-w-[340px] h-auto object-contain drop-shadow-xl"
                    />
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col gap-4 items-center mb-12 text-center"
                >
                    <h1
                        className="text-6xl font-black tracking-tighter"
                        style={{ color: colors.primary }}
                    >
                        Awaza
                    </h1>
                    <p
                        className="text-[17px] leading-relaxed px-2 font-medium"
                        style={{ color: colors.textLight }}
                    >
                        Your ultimate social media app for sharing your favorite moments and connecting with friends globally!
                    </p>
                </motion.div>

                {/* Footer Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col gap-6 w-full"
                >
                    <Button
                        title="Getting Started"
                        onClick={() => navigate('/signup')}
                        className="h-14"
                    />
                    <div className="flex flex-row justify-center items-center gap-2">
                        <span className="text-[15px] font-medium" style={{ color: colors.text }}>
                            Already have an account?
                        </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[15px] font-bold hover:opacity-70 active:scale-95 transition-all outline-none"
                            style={{ color: colors.primary }}
                        >
                            Login
                        </button>
                    </div>
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default Welcome;
