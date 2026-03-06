import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { createComment } from '../utils/actions';

const MAX_CHARS = 380;

const CommentDetails: React.FC = () => {
    const { id } = useParams(); // Format: postId_parentCommentId or just postId
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const [postId, parentCommentId] = (id || "").split("_");

    const isOverLimit = text.length > MAX_CHARS;
    const isEmpty = text.trim().length === 0;
    const isDisabled = isEmpty || isOverLimit || loading;

    const handlePost = async () => {
        if (isDisabled) return;
        if (!postId) {
            console.error("Invalid post ID");
            return;
        }

        setLoading(true);
        try {
            await createComment(postId, text.trim(), parentCommentId);
            navigate(-1);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg={colors.background}>
            <div className="flex flex-col h-full bg-white relative overflow-hidden">
                <Header
                    transparent
                    title="Write Reply"
                    showBackButton={true}
                    rightElement={
                        <Button
                            title="Reply"
                            onClick={handlePost}
                            loading={loading}
                            disabled={isDisabled}
                            className="!h-10 !rounded-[14px] !px-6 !w-auto"
                            textClassName="!text-[15px] !font-bold"
                            hasShadow={!isDisabled}
                        />
                    }
                />

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 px-8 pt-8 overflow-y-auto no-scrollbar"
                >
                    <div className="flex flex-row items-center gap-4 mb-8">
                        <Avatar uri={user?.avatar} size={48} rounded={18} className="shadow-soft" />
                        <div className="flex flex-col">
                            <span className="font-outfit font-black text-[18px] tracking-tight leading-none mb-1" style={{ color: colors.text }}>
                                {user?.name}
                            </span>
                            <span className="text-sm font-bold opacity-30 uppercase tracking-tight">
                                @{user?.username || 'user'}
                            </span>
                        </div>
                    </div>

                    <textarea
                        autoFocus
                        placeholder="Share your thoughts..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={`w-full min-h-[300px] text-[18px] font-medium bg-transparent outline-none resize-none placeholder:opacity-30 leading-relaxed ${isOverLimit ? 'text-error' : ''}`}
                        style={{ color: isOverLimit ? undefined : colors.text }}
                    />
                </motion.div>

                {/* Toolbar / Character Counter */}
                <div className="p-8 flex flex-row items-center justify-end">
                    <div className="flex flex-row items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                        <span
                            className={`text-[13px] font-bold transition-colors ${text.length > MAX_CHARS - 50 ? 'text-error' :
                                text.length > MAX_CHARS - 100 ? 'text-warning' :
                                    'opacity-40'
                                }`}
                        >
                            {text.length}
                        </span>
                        <span className="text-[13px] font-bold opacity-10">/</span>
                        <span className="text-[13px] font-bold opacity-10">{MAX_CHARS}</span>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default CommentDetails;
