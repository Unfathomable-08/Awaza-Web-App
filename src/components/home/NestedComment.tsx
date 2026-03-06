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
        // Implement backend call if necessary, but UI logic is first
    };

    const hasReplies = comment.replies && comment.replies.length > 0;
    const showThreadLine = depth > 0;

    return (
        <div className="relative">
            {/* Vertical thread line - Twitter style */}
            {showThreadLine && (
                <div
                    className="absolute w-[2px] bg-gray-100 left-4 rounded-full"
                    style={{
                        height: hasReplies || !isLastInThread ? "100%" : "40px",
                        top: hasReplies ? "0" : "40px",
                        opacity: depth >= 5 ? 0.4 : 1,
                    }}
                />
            )}

            {/* Horizontal connector line (only for replies) */}
            {depth > 0 && (
                <div
                    className="absolute w-5 h-[2px] bg-gray-100 rounded-full top-[26px] left-4"
                />
            )}

            <div
                className={`flex flex-row mt-3 min-h-[60px] ${depth === 0 ? '' : 'pl-[52px]'}`}
            >
                <div className="w-[52px] flex items-start justify-center pt-2">
                    <button onClick={() => { }} className="active:scale-95 transition-all">
                        <Avatar
                            uri={comment.user?.avatar}
                            size={34}
                            rounded={12}
                        />
                    </button>
                </div>

                <div className="flex-1 pr-4">
                    <div className="flex flex-row items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[15px]" style={{ color: colors.text }}>
                            {comment.user?.name}
                        </span>
                        <span className="text-sm font-medium opacity-30">
                            @{comment.user?.username || 'user'}
                        </span>
                        <span className="text-sm opacity-30">·</span>
                        <span className="text-sm font-bold opacity-30 uppercase tracking-tighter">
                            {timeAgo(comment.createdAt)}
                        </span>
                    </div>

                    <p className="text-[15px] font-medium leading-relaxed mt-1" style={{ color: colors.text }}>
                        {comment.content}
                    </p>

                    <div className="flex flex-row items-center gap-8 mt-3">
                        <button
                            onClick={handleLike}
                            className={`flex flex-row items-center gap-1.5 group active:scale-95 transition-all`}
                        >
                            <Heart
                                size={18}
                                className={`transition-colors ${liked ? 'fill-rose-500 text-rose-500' : 'text-gray-300 group-hover:text-rose-400'}`}
                            />
                            {likesCount > 0 && (
                                <span className={`text-sm font-bold ${liked ? 'text-rose-500' : 'opacity-30'}`}>
                                    {likesCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate(`/comment/${postId}_${comment._id}`)}
                            className="text-gray-300 hover:text-primary active:scale-95 transition-all group"
                        >
                            <MessageSquare size={18} className="group-hover:text-blue-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Render replies */}
            {hasReplies && (
                <div className="flex flex-col">
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
