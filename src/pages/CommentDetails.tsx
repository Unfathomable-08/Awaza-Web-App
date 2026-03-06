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
            alert("Invalid post ID");
            return;
        }

        setLoading(true);
        try {
            await createComment(postId, text.trim(), parentCommentId);
            alert("Your reply has been posted!");
            navigate(-1);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to post. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-full">
                <Header
                    title="Reply"
                    rightElement={
                        <Button
                            title="Post"
                            onClick={handlePost}
                            loading={loading}
                            disabled={isDisabled}
                            className="!h-9 !rounded-full !px-5 !w-auto"
                            textClassName="!text-[14px]"
                            hasShadow={false}
                        />
                    }
                />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-6 pt-10"
                >
                    <div className="flex flex-row items-center gap-3 mb-8">
                        <Avatar uri={user?.avatar} size={44} rounded={16} />
                        <div className="flex flex-col">
                            <span className="font-bold text-[17px]" style={{ color: colors.text }}>{user?.name}</span>
                            <span className="text-xs font-bold opacity-30">@{user?.username || 'user'}</span>
                        </div>
                    </div>

                    <textarea
                        autoFocus
                        placeholder="Type your reply..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={`w-full min-h-[200px] text-lg font-medium bg-transparent outline-none resize-none placeholder:opacity-30 ${isOverLimit ? 'text-rose-500' : ''
                            }`}
                        style={{ color: isOverLimit ? undefined : colors.text }}
                    />
                </motion.div>

                {/* Toolbar */}
                <div className="sticky bottom-0 bg-white border-t border-gray-50 p-4 flex flex-row items-center justify-end overflow-hidden pb-10">
                    <div className="flex flex-row items-center gap-1.5">
                        <span
                            className={`text-sm font-bold transition-colors ${text.length > 300 ? 'text-rose-500' :
                                    text.length > 200 ? 'text-amber-500' :
                                        'opacity-30'
                                }`}
                        >
                            {text.length}
                        </span>
                        <span className="text-sm font-black opacity-10">/</span>
                        <span className="text-sm font-bold opacity-10">{MAX_CHARS}</span>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default CommentDetails;
