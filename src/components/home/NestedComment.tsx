import { motion } from 'framer-motion';
import { Heart, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../constants/Colors';
import { timeAgo } from '../../utils/common';
import Avatar from '../Avatar';

interface NestedCommentProps {
    comment: any;
    postId: string;
    currentUserId?: string;
    depth: number;
    isLastInThread?: boolean;
}

export const NestedComment: React.FC<NestedCommentProps> = ({
    comment,
    postId,
    currentUserId,
    depth = 0,
    isLastInThread = false,
}) => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(comment.likes?.includes(currentUserId));
    const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev: number) => newLiked ? prev + 1 : prev - 1);
    };

    const hasReplies = comment.replies && comment.replies.length > 0;
    const showThreadLine = depth > 0;

    return (
        <div className="relative">
            {/* Vertical thread line */}
            {showThreadLine && (
                <div
                    className="absolute w-[1.5px] bg-gray-100 left-5 rounded-full"
                    style={{
                        height: hasReplies || !isLastInThread ? "100%" : "30px",
                        top: hasReplies ? "0" : "30px",
                        opacity: 0.5,
                    }}
                />
            )}

            <div
                className={`flex flex-row mt-4 ${depth === 0 ? '' : 'pl-6'}`}
            >
                <div className="flex flex-col items-center">
                    <Avatar
                        uri={comment.user?.avatar}
                        size={36}
                        rounded={14}
                        onClick={() => navigate(`/profile/${comment.user?._id || comment.user?.id}`)}
                    />
                    {hasReplies && (
                        <div className="flex-1 w-[1.5px] bg-gray-100 my-2 opacity-50 rounded-full" />
                    )}
                </div>

                <div className="flex-1 pl-4 pr-2 pb-6">
                    <div className="flex flex-row items-center gap-2 mb-1.5 flex-wrap">
                        <span
                            className="font-outfit font-black text-[15px] opacity-80 cursor-pointer hover:text-primary transition-colors"
                            style={{ color: colors.text }}
                            onClick={() => navigate(`/profile/${comment.user?._id || comment.user?.id}`)}
                        >
                            {comment.user?.name}
                        </span>
                        <span className="text-[12px] font-bold opacity-20 uppercase tracking-tight">
                            · {timeAgo(comment.createdAt)}
                        </span>
                    </div>

                    <p className="text-[15px] font-medium leading-relaxed" style={{ color: colors.textLight }}>
                        {comment.content}
                    </p>

                    <div className="flex flex-row items-center gap-7 mt-3.5">
                        <button
                            onClick={handleLike}
                            className="flex flex-row items-center gap-2 group outline-none"
                        >
                            <motion.div
                                whileTap={{ scale: 1.4 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Heart
                                    size={18}
                                    strokeWidth={liked ? 0 : 2.5}
                                    className={`transition-all ${liked ? 'fill-error scale-110' : 'text-gray-200 group-hover:text-error'}`}
                                    style={{ color: liked ? colors.error : undefined }}
                                />
                            </motion.div>
                            {likesCount > 0 && (
                                <span className={`text-[13px] font-bold ${liked ? 'text-error' : 'opacity-20 transition-opacity group-hover:opacity-100'}`}>
                                    {likesCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate(`/comment/${postId}_${comment._id}`)}
                            className="flex flex-row items-center gap-2 group outline-none"
                        >
                            <MessageSquare
                                size={18}
                                strokeWidth={2.5}
                                className="text-gray-200 group-hover:text-info transition-colors"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Render replies */}
            {hasReplies && (
                <div className="flex flex-col ml-8">
                    {comment.replies.map((reply: any, index: number) => (
                        <NestedComment
                            key={reply._id}
                            comment={reply}
                            postId={postId}
                            currentUserId={currentUserId}
                            depth={depth + 1}
                            isLastInThread={index === comment.replies.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
