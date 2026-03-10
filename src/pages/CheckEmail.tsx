/**
 * @file CheckEmail.tsx
 * @description OTP (One Time Password) entry screen for email verification.
 *
 * Features:
 *  - 6-digit auto-advancing input fields
 *  - Supports paste functionality (pastes full code across fields)
 *  - Shakes on validation error using Framer Motion
 *  - Resend cooldown/feedback
 */

import { motion } from 'framer-motion';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../components/ScreenWrapper';
import { resendCode, verifyCode } from '../utils/auth';

/**
 * CheckEmail
 *
 * Focus is managed automatically when typing or backspacing between the 6
 * separate input boxes. `inputMode="numeric"` is used to show the number
 * pad on mobile devices.
 */
const CheckEmail: React.FC = () => {
    const navigate = useNavigate();
    
    // ── Form state ───────────────────────────────────────────────────────
    const [code,          setCode]          = useState(['', '', '', '', '', '']);
    const [loading,       setLoading]       = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [codeSent,      setCodeSent]      = useState(false);
    
    /** Array of indices to animate shaking for validation feedback */
    const [shakeIndex,    setShakeIndex]    = useState<number[]>([]);
    
    /** Array of refs to manage focus between the 6 inputs */
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    /** Auto-focus the first slot on mount */
    useEffect(() => { inputRefs.current[0]?.focus(); }, []);

    /** Handle single character entry */
    const handleChange = (value: string, index: number) => {
        const char = value.slice(-1).replace(/\D/g, ''); // Extract only digits
        if (!char && value !== '') return;
        
        const newCode = [...code]; 
        newCode[index] = char; 
        setCode(newCode);
        
        // Advance to next slot if a digit was entered
        if (char && index < 5) inputRefs.current[index + 1]?.focus();
    };

    /** Handle backspace (move to previous input if current is empty) */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    /** Handle paste events stringing digits across all 6 slots */
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
        const newCode = [...code];
        
        pasted.split('').forEach((char, i) => { if (i < 6) newCode[i] = char; });
        setCode(newCode);
        
        // Focus the input just after the last pasted digit (or the final one if 6 chars)
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    /** Validate and submit the OTP */
    const onVerify = async () => {
        const fullCode = code.join('');
        
        // Client-side guard: shake empty slots
        if (fullCode.length < 6) {
            const empties = code.map((c, i) => c === '' ? i : -1).filter(i => i !== -1);
            setShakeIndex(empties); 
            setTimeout(() => setShakeIndex([]), 600); 
            return;
        }
        
        setLoading(true);
        try { 
            await verifyCode(fullCode); 
            navigate('/home'); 
        } catch { 
            // On API error, shake all slots
            setShakeIndex([0,1,2,3,4,5]); 
            setTimeout(() => setShakeIndex([]), 600); 
        } finally { 
            setLoading(false); 
        }
    };

    /** Request a new OTP email */
    const onResend = async () => {
        setResendLoading(true);
        try {
            await resendCode();
            setCodeSent(true); 
            setTimeout(() => setCodeSent(false), 4000); // Hide success badge after 4s
            setCode(['', '', '', '', '', '']); 
            inputRefs.current[0]?.focus();
        } catch { 
            console.error('Resend failed'); 
        } finally { 
            setResendLoading(false); 
        }
    };

    const allFilled = code.join('').length === 6;

    return (
        <ScreenWrapper>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col min-h-full px-6 pt-14 pb-10 justify-between"
            >
                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-[32px] font-outfit font-black tracking-tight mb-2 text-primary">
                        Verify Email
                    </h1>
                    <p className="text-[15px] font-medium leading-relaxed mb-1 text-muted">
                        We sent a 6-digit code to your email
                    </p>
                    <span className="text-[13px] text-muted opacity-50">
                        Check spam if not received
                    </span>
                </div>

                {/* ── 6-Slot OTP Inputs ── */}
                <div className="flex flex-row justify-between gap-2 my-10">
                    {code.map((digit, i) => (
                        <motion.div
                            key={i}
                            animate={shakeIndex.includes(i) ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                            transition={{ duration: 0.35 }}
                            className={`
                                flex-1 aspect-square max-w-13 rounded-xl border-2 flex items-center justify-center transition-all
                                ${digit ? 'border-primary bg-primary-5' : 'border-app bg-input'}
                            `}
                        >
                            <input
                                ref={el => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onPaste={handlePaste}
                                className="w-full h-full text-center text-[22px] font-black bg-transparent outline-none text-app"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* ── Action buttons ── */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Primary Verify Button */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onVerify}
                        disabled={loading || !allFilled}
                        className={`
                            w-full h-12 rounded-xl font-bold text-[16px] 
                            flex items-center justify-center transition-all shadow-premium
                            ${(allFilled && !loading) 
                                ? 'bg-primary text-white' 
                                : 'bg-separator text-muted opacity-80 cursor-not-allowed'}
                        `}
                    >
                        {loading ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : 'Verify Code'}
                    </motion.button>

                    {/* Resend button */}
                    <button
                        onClick={onResend}
                        disabled={resendLoading}
                        className="
                            flex flex-row items-center justify-center gap-2.5 py-3.5 
                            rounded-xl border-2 font-bold active:bg-black/3 transition-all outline-none
                            border-app text-primary
                        "
                    >
                        <RefreshCcw size={18} className={resendLoading ? 'animate-spin' : ''} />
                        <span className="text-[15px]">{resendLoading ? 'Sending...' : 'Resend Code'}</span>
                    </button>

                    {/* Temporary success badge */}
                    {codeSent && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-row items-center justify-center gap-2 p-3.5 rounded-xl border bg-primary-8 border-primary-20"
                        >
                            <CheckCircle size={16} className="text-primary" />
                            <span className="text-[13px] font-bold text-primary">Code sent!</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </ScreenWrapper>
    );
};

export default CheckEmail;
