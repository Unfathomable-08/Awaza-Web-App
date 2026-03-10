/**
 * @file PostItem.tsx
 * @description A single post card used inside the feed.
 *
 * Displays:
 *  - Author avatar, name, and relative timestamp
 *  - Post text content
 *  - Optional inline image (lazy-loaded, motion-animated)
 *  - Interaction row: like (toggle), comment counter, share
 *
 * Optimised with `memo` so React only re-renders when the post data changes.
 */

import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likePost } from '../utils/actions';
import { timeAgo } from '../utils/common';
import Avatar from './Avatar';

/** Props for the PostItem component */
interface PostItemProps {
    /** Full post object from the API */
    item: any;
    /** The currently authenticated user (used to determine liked state) */
    currentUser?: any;
    /** Stagger index used to delay the entrance animation */
    index?: number;
}

/**
 * PostItem
 *
 * Renders a Twitter-style post row.  Tapping anywhere on the card navigates
 * to the post detail page.  The like button performs an optimistic update —
 * UI changes instantly and reverts on API error.
 */
const PostItem: React.FC<PostItemProps> = ({ item, currentUser, index = 0 }) => {
    const navigate = useNavigate();

    // ── Local interaction state ──────────────────────────────────────────
    const [liked, setLiked]           = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    /** Sync liked state from the post object */
    useEffect(() => {
        if (!item) return;

        setLikesCount(item?.likesCount || item?.likes?.length || 0);

        const userId = currentUser?._id || currentUser?.id;
        if (userId && item?.likes) {
            const isLiked = item.likes.some(
                (id: any) => (typeof id === 'string' ? id : id._id) === userId
            );
            setLiked(isLiked);
        }
    }, [item, currentUser]);

    // ── Event handlers ───────────────────────────────────────────────────

    /** Navigate to the PostDetails page */
    const openPostDetails = () =>
        navigate(`/post/${item?._id || item?.id}`);

    /**
     * Optimistically toggle the like state.
     * If the API call fails, the state is rolled back.
     */
    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the card click from firing
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

        try {
            await likePost(item?._id || item?.id);
        } catch {
            // Roll back on failure
            setLiked(!newLiked);
            setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
        }
    };

    const createdAt = timeAgo(item?.createdAt || new Date().toISOString());

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={openPostDetails}
            className="
                flex flex-col bg-app border-b border-sep
                cursor-pointer active:bg-gray-50/80
                transition-colors px-4 py-3
            "
        >
            {/* ── User info header ── */}
            <div className="flex flex-row justify-between items-center mb-2.5">
                <div className="flex flex-row items-center gap-2.5">
                    <Avatar
                        size={40}
                        uri={item?.user?.avatar}
                        onClick={() => navigate(`/profile/${item?.user?._id || item?.user?.id}`)}
                    />

                    <div className="flex flex-col">
                        {/* Author name — navigate to profile on tap */}
                        <span
                            className="
                                font-outfit font-bold text-[15px]
                                tracking-tight leading-tight
                                text-app hover:text-primary transition-colors
                                cursor-pointer
                            "
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${item?.user?._id || item?.user?.id}`);
                            }}
                        >
                            {item?.user?.name}
                        </span>

                        {/* Relative timestamp */}
                        <span className="text-[12px] font-medium text-muted">
                            {createdAt}
                        </span>
                    </div>
                </div>

                {/* More options — stopPropagation so card click doesn't fire */}
                <button
                    className="
                        w-8 h-8 flex items-center justify-center
                        rounded-full hover:bg-black/5
                        active:scale-90 transition-all
                    "
                    onClick={e => e.stopPropagation()}
                    aria-label="More options"
                >
                    <MoreHorizontal size={18} className="text-muted" />
                </button>
            </div>

            {/* ── Post content ── */}
            <div className="flex flex-col gap-3 mb-1">
                {item?.content && (
                    <p className="text-[15px] leading-[1.55] font-normal text-light">
                        {item?.content}
                    </p>
                )}

                {/* Post image (lazy-loaded with fade-in) */}
                {item?.image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="
                            w-full rounded-2xl overflow-hidden
                            shadow-soft border border-card
                        "
                    >
                        <img
                            src={item?.image}
                            alt="Post content"
                            className="w-full h-auto object-cover max-h-96"
                            loading="lazy"
                        />
                    </motion.div>
                )}
            </div>

            {/* ── Interaction footer ── */}
            <div className="flex flex-row items-center gap-1 mt-0.5 -ml-2">

                {/* Like button — spring animation on tap */}
                <button
                    onClick={handleLike}
                    className="flex flex-row items-center outline-none"
                    aria-label={liked ? 'Unlike post' : 'Like post'}
                    aria-pressed={liked}
                >
                    <motion.div
                        whileTap={{ scale: 1.4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        className={`
                            w-9 h-9 flex items-center justify-center rounded-full transition-colors
                            ${liked ? 'bg-error-8' : ''}
                        `}
                    >
                        <Heart
                            size={19}
                            strokeWidth={liked ? 0 : 2}
                            className={`transition-all duration-150 ${liked ? 'text-error fill-error' : 'text-muted'}`}
                        />
                    </motion.div>

                    {/* Hide count when zero to reduce visual noise */}
                    {likesCount > 0 && (
                        <span className={`text-[13px] font-semibold ${liked ? 'text-error' : 'text-muted'}`}>
                            {likesCount}
                        </span>
                    )}
                </button>

                {/* Comment count */}
                <button className="flex flex-row items-center outline-none">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full">
                        <MessageCircle size={19} strokeWidth={2} className="text-muted" />
                    </div>
                    {item?.commentsCount > 0 && (
                        <span className="text-[13px] font-semibold text-muted">
                            {item.commentsCount}
                        </span>
                    )}
                </button>

                {/* Share — aligned to the right */}
                <button
                    className="ml-auto w-9 h-9 flex items-center justify-center rounded-full outline-none"
                    aria-label="Share post"
                >
                    <Share2 size={18} strokeWidth={2} className="text-muted" />
                </button>
            </div>
        </motion.div>
    );
};

export default memo(PostItem);
