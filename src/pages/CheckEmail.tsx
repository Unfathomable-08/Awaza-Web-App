import { motion } from 'framer-motion';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../components/ScreenWrapper';
import { resendCode, verifyCode } from '../utils/auth';

const CheckEmail: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [shakeIndex, setShakeIndex] = useState<number[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => { inputRefs.current[0]?.focus(); }, []);

    const handleChange = (value: string, index: number) => {
        const char = value.slice(-1).replace(/\D/g, '');
        if (!char && value !== '') return;
        const newCode = [...code]; newCode[index] = char; setCode(newCode);
        if (char && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
        const newCode = [...code];
        pasted.split('').forEach((char, i) => { if (i < 6) newCode[i] = char; });
        setCode(newCode);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const onVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            const empties = code.map((c, i) => c === '' ? i : -1).filter(i => i !== -1);
            setShakeIndex(empties); setTimeout(() => setShakeIndex([]), 600); return;
        }
        setLoading(true);
        try { await verifyCode(fullCode); navigate('/home'); }
        catch { setShakeIndex([0,1,2,3,4,5]); setTimeout(() => setShakeIndex([]), 600); }
        finally { setLoading(false); }
    };

    const onResend = async () => {
        setResendLoading(true);
        try {
            await resendCode();
            setCodeSent(true); setTimeout(() => setCodeSent(false), 4000);
            setCode(['', '', '', '', '', '']); inputRefs.current[0]?.focus();
        } catch { console.error('Resend failed'); }
        finally { setResendLoading(false); }
    };

    const allFilled = code.join('').length === 6;

    return (
        <ScreenWrapper>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col min-h-full px-6 pt-14 pb-10 justify-between"
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-[32px] font-outfit font-black tracking-tight mb-2" style={{ color: 'var(--color-primary)' }}>
                        Verify Email
                    </h1>
                    <p className="text-[15px] font-medium leading-relaxed mb-1" style={{ color: 'var(--color-text-muted)' }}>
                        We sent a 6-digit code to your email
                    </p>
                    <span className="text-[13px]" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
                        Check spam if not received
                    </span>
                </div>

                {/* OTP Inputs */}
                <div className="flex flex-row justify-between gap-2 my-10">
                    {code.map((digit, i) => (
                        <motion.div
                            key={i}
                            animate={shakeIndex.includes(i) ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                            transition={{ duration: 0.35 }}
                            className="flex-1 aspect-square max-w-[52px] rounded-xl border-2 flex items-center justify-center transition-all"
                            style={{
                                borderColor: digit ? 'var(--color-primary)' : 'var(--color-border)',
                                backgroundColor: digit ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'var(--color-input-bg)',
                            }}
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
                                className="w-full h-full text-center text-[22px] font-black bg-transparent outline-none"
                                style={{ color: 'var(--color-text)' }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onVerify}
                        disabled={loading || !allFilled}
                        className="w-full h-12 rounded-xl font-bold text-[16px] flex items-center justify-center transition-all shadow-premium"
                        style={{
                            backgroundColor: allFilled && !loading ? 'var(--color-primary)' : 'var(--color-separator)',
                            color: allFilled && !loading ? 'white' : 'var(--color-text-muted)',
                        }}
                    >
                        {loading ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : 'Verify Code'}
                    </motion.button>

                    <button
                        onClick={onResend}
                        disabled={resendLoading}
                        className="flex flex-row items-center justify-center gap-2.5 py-3.5 rounded-xl border-2 font-bold active:bg-black/3 transition-all outline-none"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
                    >
                        <RefreshCcw size={18} className={resendLoading ? 'animate-spin' : ''} />
                        <span className="text-[15px]">{resendLoading ? 'Sending...' : 'Resend Code'}</span>
                    </button>

                    {codeSent && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-row items-center justify-center gap-2 p-3.5 rounded-xl border"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
                                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                            }}
                        >
                            <CheckCircle size={16} style={{ color: 'var(--color-primary)' }} />
                            <span className="text-[13px] font-bold" style={{ color: 'var(--color-primary)' }}>Code sent!</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </ScreenWrapper>
    );
};

export default CheckEmail;
