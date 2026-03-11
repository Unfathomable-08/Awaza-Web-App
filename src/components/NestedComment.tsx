/**
 * @file NestedComment.tsx
 * @description Recursive comment thread renderer.
 *
 * Renders a single comment and, if it has replies, recursively renders each
 * reply indented by 28 px (`ml-7`).  Vertical thread lines connect a parent
 * comment to its children for visual threading (similar to Twitter/Threads).
 *
 * Usage:
 * ```tsx
 * <NestedComment comment={rootComment} postId="abc" currentUserId="u1" depth={0} />
 * ```
 */

import { motion } from 'framer-motion';
import { Heart, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../utils/common';
import Avatar from './Avatar';

/** Props for the NestedComment component */
interface NestedCommentProps {
    /** Comment object — may contain a `replies` array of child comments */
    comment: any;
    /** ID of the parent post, used to build the reply navigation path */
    postId: string;
    /** ID of the authenticated user to determine liked state */
    currentUserId?: string;
    /**
     * Nesting depth (0 = root comment).
     * Controls whether the left-side thread line is rendered.
     */
    depth?: number;
    /** When true, the thread line stops at mid-height (no more siblings below) */
    isLastInThread?: boolean;
}

/**
 * NestedComment
 *
 * The vertical thread line is rendered as an absolutely-positioned div on the
 * left side of the comment.  The heart button performs an optimistic local
 * state update only — a real API call should be wired in `handleLike`.
 */
export const NestedComment: React.FC<NestedCommentProps> = ({
    comment,
    postId,
    currentUserId,
    depth = 0,
    isLastInThread = false,
}) => {
    const navigate = useNavigate();

    // ── Local interaction state ──────────────────────────────────────────
    const [liked, setLiked] = useState(comment.likes?.includes(currentUserId));
    const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

    const hasReplies = comment.replies && comment.replies.length > 0;
    const showLine = depth > 0; // Only show thread line for nested replies

    /**
     * Optimistic like toggle.
     * TODO: wire up the real like-comment API call here.
     */
    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked((prev: boolean) => !prev);
        setLikesCount((prev: number) => liked ? prev - 1 : prev + 1);
    };

    return (
        <div className="relative">
            {/* ── Vertical thread line ── */}
            {showLine && (
                <div
                    className="absolute -left-3 rounded-full bg-app border-l-2 border-sep opacity-50"
                    style={{
                        width: 1.5,
                        /* Extend to bottom when there are more siblings, else stop at avatar centre */
                        height: hasReplies || !isLastInThread ? '100%' : 28,
                        top: hasReplies ? 0 : 28,
                    }}
                />
            )}

            {/* ── Comment row ── */}
            <div className={`flex flex-row mt-3 ${depth === 0 ? '' : 'pl-2'}`}>

                {/* Column: avatar + continuation line */}
                <div className="flex flex-col items-center">
                    <Avatar
                        uri={comment.user?.avatar}
                        size={34}
                        onClick={() => navigate(`/profile/${comment.user?.username}`)}
                    />

                    {/* Line segment connecting avatar to child replies */}
                    {hasReplies && (
                        <div className="flex-1 my-1.5 rounded-full bg-sep opacity-50"
                            style={{ width: 1.5 }}
                        />
                    )}
                </div>

                {/* Column: comment content */}
                <div className="flex-1 pl-3 pr-2 pb-4">
                    {/* Author + timestamp */}
                    <div className="flex flex-row items-center gap-1.5 mb-1 flex-wrap">
                        <span
                            className="
                                font-outfit font-bold text-[14px] text-app
                                cursor-pointer hover:text-primary transition-colors
                            "
                            onClick={() =>
                                navigate(`/profile/${comment.user?.username}`)
                            }
                        >
                            {comment.user?.name}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-tight text-muted opacity-50">
                            · {timeAgo(comment.createdAt)}
                        </span>
                    </div>

                    {/* Comment body */}
                    <p className="text-[14px] font-normal leading-relaxed text-light">
                        {comment.content}
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-row items-center gap-5 mt-2.5">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className="flex flex-row items-center gap-1.5 outline-none"
                            aria-label={liked ? 'Unlike' : 'Like'}
                            aria-pressed={liked}
                        >
                            <motion.div
                                whileTap={{ scale: 1.4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <Heart
                                    size={16}
                                    strokeWidth={liked ? 0 : 2}
                                    className={`transition-all duration-150 ${liked ? 'text-error fill-error' : 'text-muted'}`}
                                />
                            </motion.div>

                            {likesCount > 0 && (
                                <span className={`text-[12px] font-semibold ${liked ? 'text-error' : 'text-muted'}`}>
                                    {likesCount}
                                </span>
                            )}
                        </button>

                        {/* Reply — navigates to CommentDetails */}
                        <button
                            onClick={() => navigate(`/comment/${postId}_${comment._id}`)}
                            className="flex flex-row items-center gap-1.5 outline-none"
                            aria-label="Reply to comment"
                        >
                            <MessageSquare
                                size={16}
                                strokeWidth={2}
                                className="text-muted"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Replies (recursive) ── */}
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
