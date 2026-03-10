import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { createComment } from '../utils/actions';

const MAX_CHARS = 380;

const CommentDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const [postId, parentCommentId] = (id || '').split('_');
    const isOverLimit = text.length > MAX_CHARS;
    const isEmpty = text.trim().length === 0;
    const isDisabled = isEmpty || isOverLimit || loading;

    const handlePost = async () => {
        if (isDisabled || !postId) return;
        setLoading(true);
        try { await createComment(postId, text.trim(), parentCommentId); navigate(-1); }
        catch (error: any) { console.error(error); }
        finally { setLoading(false); }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-full relative overflow-hidden">
                <Header
                    transparent
                    title="Reply"
                    showBackButton={true}
                    rightElement={
                        <Button
                            title="Reply"
                            onClick={handlePost}
                            loading={loading}
                            disabled={isDisabled}
                            className="!h-8 !rounded-full !px-4 !w-auto !text-[13px]"
                        />
                    }
                />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 px-5 pt-5 overflow-y-auto no-scrollbar"
                >
                    <div className="flex flex-row items-center gap-3 mb-5">
                        <Avatar uri={user?.avatar} size={40} />
                        <div className="flex flex-col">
                            <span className="font-outfit font-black text-[16px] tracking-tight leading-none mb-0.5" style={{ color: 'var(--color-text)' }}>
                                {user?.name}
                            </span>
                            <span className="text-[12px] font-bold uppercase tracking-tight" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
                                @{user?.username || 'user'}
                            </span>
                        </div>
                    </div>

                    <textarea
                        autoFocus
                        placeholder="Share your thoughts..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full min-h-[240px] text-[16px] font-normal bg-transparent outline-none resize-none leading-relaxed"
                        style={{
                            color: isOverLimit ? 'var(--color-error)' : 'var(--color-text)',
                            caretColor: 'var(--color-primary)',
                        }}
                    />
                </motion.div>

                {/* Char Counter */}
                <div className="px-5 py-3 flex flex-row items-center justify-end border-t" style={{ borderColor: 'var(--color-separator)' }}>
                    <span
                        className="text-[12px] font-semibold"
                        style={{
                            color: text.length > MAX_CHARS - 50
                                ? 'var(--color-error)'
                                : text.length > MAX_CHARS - 100
                                    ? 'var(--color-warning)'
                                    : 'var(--color-text-muted)',
                            opacity: text.length > MAX_CHARS - 100 ? 1 : 0.5,
                        }}
                    >
                        {text.length} / {MAX_CHARS}
                    </span>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default CommentDetails;
