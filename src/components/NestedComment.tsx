import { motion } from 'framer-motion';
import { Heart, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../utils/common';
import Avatar from './Avatar';

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
                    className="absolute left-4 rounded-full"
                    style={{
                        width: '1.5px',
                        backgroundColor: 'var(--color-border)',
                        opacity: 0.5,
                        height: hasReplies || !isLastInThread ? '100%' : '28px',
                        top: hasReplies ? '0' : '28px',
                    }}
                />
            )}

            <div className={`flex flex-row mt-3 ${depth === 0 ? '' : 'pl-5'}`}>
                <div className="flex flex-col items-center">
                    <Avatar
                        uri={comment.user?.avatar}
                        size={34}
                        onClick={() => navigate(`/profile/${comment.user?._id || comment.user?.id}`)}
                    />
                    {hasReplies && (
                        <div
                            className="flex-1 my-1.5 rounded-full"
                            style={{ width: '1.5px', backgroundColor: 'var(--color-border)', opacity: 0.5 }}
                        />
                    )}
                </div>

                <div className="flex-1 pl-3 pr-2 pb-4">
                    <div className="flex flex-row items-center gap-1.5 mb-1 flex-wrap">
                        <span
                            className="font-outfit font-bold text-[14px] cursor-pointer hover:text-primary transition-colors"
                            style={{ color: 'var(--color-text)' }}
                            onClick={() => navigate(`/profile/${comment.user?._id || comment.user?.id}`)}
                        >
                            {comment.user?.name}
                        </span>
                        <span
                            className="text-[11px] font-semibold uppercase tracking-tight"
                            style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
                        >
                            · {timeAgo(comment.createdAt)}
                        </span>
                    </div>

                    <p
                        className="text-[14px] font-normal leading-relaxed"
                        style={{ color: 'var(--color-text-light)' }}
                    >
                        {comment.content}
                    </p>

                    <div className="flex flex-row items-center gap-5 mt-2.5">
                        <button
                            onClick={handleLike}
                            className="flex flex-row items-center gap-1.5 group outline-none"
                        >
                            <motion.div
                                whileTap={{ scale: 1.4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <Heart
                                    size={16}
                                    strokeWidth={liked ? 0 : 2}
                                    style={{
                                        color: liked ? 'var(--color-error)' : 'var(--color-border)',
                                        fill: liked ? 'var(--color-error)' : 'transparent',
                                        transition: 'all 0.15s ease',
                                    }}
                                />
                            </motion.div>
                            {likesCount > 0 && (
                                <span
                                    className="text-[12px] font-semibold"
                                    style={{ color: liked ? 'var(--color-error)' : 'var(--color-text-muted)' }}
                                >
                                    {likesCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate(`/comment/${postId}_${comment._id}`)}
                            className="flex flex-row items-center gap-1.5 group outline-none"
                        >
                            <MessageSquare
                                size={16}
                                strokeWidth={2}
                                style={{ color: 'var(--color-border)' }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Render replies */}
            {hasReplies && (
                <div className="flex flex-col ml-7">
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
