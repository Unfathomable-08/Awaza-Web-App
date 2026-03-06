import { motion } from 'framer-motion';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { resendCode, verifyCode } from '../utils/auth';

const CheckEmail: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [shakeIndex, setShakeIndex] = useState<number[]>([]);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Auto focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (value: string, index: number) => {
        const char = value.slice(-1).replace(/\D/g, '');
        if (!char && value !== '') return;

        const newCode = [...code];
        newCode[index] = char;
        setCode(newCode);

        if (char && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
        const newCode = [...code];

        pastedData.split('').forEach((char, i) => {
            if (i < 6) newCode[i] = char;
        });

        setCode(newCode);
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const onVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            // Trigger shake for empty slots
            const emptyIndices = code.map((c, i) => c === '' ? i : -1).filter(i => i !== -1);
            setShakeIndex(emptyIndices);
            setTimeout(() => setShakeIndex([]), 600);
            return;
        }

        setLoading(true);
        try {
            await verifyCode(fullCode);
            // On success, redirect to home
            navigate('/home');
        } catch (error) {
            console.error("Verification failed", error);
            // Shake all on error
            setShakeIndex([0, 1, 2, 3, 4, 5]);
            setTimeout(() => setShakeIndex([]), 600);
        } finally {
            setLoading(false);
        }
    };

    const onResend = async () => {
        setResendLoading(true);
        try {
            await resendCode();
            setCodeSent(true);
            setTimeout(() => setCodeSent(false), 4000);
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error("Resend failed", error);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col min-h-full px-6 pt-12 pb-10 justify-between"
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center mt-8">
                    <h1 className="text-4xl font-black tracking-tighter mb-4" style={{ color: colors.primary }}>
                        Verify Email
                    </h1>
                    <p className="text-[17px] font-medium leading-relaxed opacity-70 mb-2" style={{ color: colors.text }}>
                        We've sent a 6-digit code to your email
                    </p>
                    <span className="text-[14px] font-semibold opacity-50">
                        Check your spam folder if not received
                    </span>
                </div>

                {/* OTP Inputs */}
                <div className="flex flex-row justify-between gap-2.5 my-12">
                    {code.map((digit, i) => (
                        <motion.div
                            key={i}
                            animate={shakeIndex.includes(i) ? {
                                x: [0, -10, 10, -10, 10, 0],
                                borderColor: colors.error
                            } : {}}
                            transition={{ duration: 0.4 }}
                            className={`flex-1 aspect-square max-w-[50px] rounded-2xl border-2 flex items-center justify-center transition-all ${digit ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50'
                                }`}
                            style={{ borderColor: digit ? colors.primary : undefined }}
                        >
                            <input
                                ref={el => { inputRefs.current[i] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onPaste={handlePaste}
                                className="w-full h-full text-center text-2xl font-black bg-transparent outline-none"
                                style={{ color: colors.text }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-6 w-full">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onVerify}
                        disabled={loading || code.join('').length < 6}
                        className={`w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center transition-all ${loading || code.join('').length < 6 ? 'bg-gray-200 text-gray-400 brightness-100 shadow-none' : 'text-white active:brightness-90'
                            }`}
                        style={{ backgroundColor: !loading && code.join('').length === 6 ? colors.primary : undefined }}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Verify Code'
                        )}
                    </motion.button>

                    <button
                        onClick={onResend}
                        disabled={resendLoading}
                        className="flex flex-row items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-100 font-bold active:bg-gray-50 transition-all outline-none"
                        style={{ color: colors.primary }}
                    >
                        <RefreshCcw size={20} className={resendLoading ? 'animate-spin' : ''} />
                        <span>{resendLoading ? 'Sending...' : 'Resend Code'}</span>
                    </button>

                    {codeSent && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-row items-center justify-center gap-2 p-4 bg-primary/10 rounded-2xl border border-primary/20"
                        >
                            <CheckCircle size={18} style={{ color: colors.primary }} />
                            <span className="text-sm font-bold" style={{ color: colors.primary }}>New code sent!</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </ScreenWrapper>
    );
};

export default CheckEmail;
