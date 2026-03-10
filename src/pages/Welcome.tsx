/**
 * @file Welcome.tsx
 * @description Landing / onboarding page shown to unauthenticated users.
 *
 * Staggered entrance animations guide the user's eye from the hero image,
 * to the brand name, to the call-to-action buttons.
 */

import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/images/welcome.png';
import Button from '../components/Button';
import ScreenWrapper from '../components/ScreenWrapper';

/**
 * Welcome
 *
 * Three-section layout:
 *  1. **Hero area** — large illustration (expands to fill available space)
 *  2. **Brand copy** — "Awaza" title + tagline
 *  3. **CTAs** — "Get Started" button + "Sign In" text link
 */
const Welcome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-svh justify-between pb-10 px-5 overflow-hidden">

                {/* ── Hero image ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.05, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex items-center justify-center pt-16"
                >
                    <img
                        src={welcomeImage}
                        alt="People connected through Awaza"
                        className="w-52 aspect-square object-contain drop-shadow-2xl"
                    />
                </motion.div>

                {/* ── Brand copy ── */}
                <div className="flex flex-col items-center text-center mb-8 px-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="text-5xl font-outfit font-black tracking-tight mb-2 text-primary"
                    >
                        Awaza 2.0
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="text-[15px] font-medium leading-relaxed text-muted"
                    >
                        Experience the next generation of social connection.
                    </motion.p>
                </div>

                {/* ── CTA buttons ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-col gap-4 w-full"
                >
                    <Button
                        title="Get Started"
                        onClick={() => navigate('/signup')}
                        hasShadow
                    />

                    <div className="flex flex-row justify-center items-center gap-1.5">
                        <span className="text-[14px] font-medium text-muted">
                            Have an account?
                        </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[14px] font-bold text-primary active-scale transition-opacity hover:opacity-70"
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
