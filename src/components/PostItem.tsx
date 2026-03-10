import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likePost } from '../utils/actions';
import { timeAgo } from '../utils/common';
import Avatar from './Avatar';

interface PostItemProps {
    item: any;
    currentUser?: any;
    index?: number;
}

const PostItem: React.FC<PostItemProps> = ({ item, currentUser, index = 0 }) => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        if (!item) return;
        setLikesCount(item?.likesCount || item?.likes?.length || 0);

        const userId = currentUser?._id || currentUser?.id;
        if (userId && item?.likes) {
            const isLiked = item.likes.some((id: any) =>
                (typeof id === 'string' ? id : id._id) === userId
            );
            setLiked(isLiked);
        }
    }, [item, currentUser]);

    const openPostDetails = () => {
        navigate(`/post/${item?._id || item?.id}`);
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

        try {
            await likePost(item?._id || item?.id);
        } catch (error) {
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
            className="flex flex-col bg-white border-b cursor-pointer active:bg-gray-50/80 transition-colors px-4 py-3"
            style={{ borderColor: 'var(--color-separator)' }}
        >
            {/* User Info Header */}
            <div className="flex flex-row justify-between items-center mb-2.5">
                <div className="flex flex-row items-center gap-2.5">
                    <Avatar
                        size={40}
                        uri={item?.user?.avatar}
                        onClick={() => navigate(`/profile/${item?.user?._id || item?.user?.id}`)}
                    />
                    <div className="flex flex-col">
                        <span
                            className="font-outfit font-bold text-[15px] tracking-tight leading-tight hover:text-primary transition-colors"
                            style={{ color: 'var(--color-text)' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${item?.user?._id || item?.user?.id}`);
                            }}
                        >
                            {item?.user?.name}
                        </span>
                        <span
                            className="text-[12px] font-medium"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {createdAt}
                        </span>
                    </div>
                </div>

                <button
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all"
                    onClick={e => e.stopPropagation()}
                >
                    <MoreHorizontal size={18} style={{ color: 'var(--color-text-muted)' }} />
                </button>
            </div>

            {/* Post Content */}
            <div className="flex flex-col gap-3 mb-1">
                {item?.content && (
                    <p
                        className="text-[15px] leading-[1.55] font-normal"
                        style={{ color: 'var(--color-text-light)' }}
                    >
                        {item?.content}
                    </p>
                )}

                {item?.image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full rounded-2xl overflow-hidden shadow-soft border"
                        style={{ borderColor: 'var(--color-card-border)' }}
                    >
                        <img
                            src={item?.image}
                            alt="Post Content"
                            className="w-full h-auto object-cover max-h-96"
                            loading="lazy"
                        />
                    </motion.div>
                )}
            </div>

            {/* Interaction Footer */}
            <div className="flex flex-row items-center gap-1 mt-0.5 -ml-2">
                {/* Like */}
                <button
                    onClick={handleLike}
                    className="flex flex-row items-center group outline-none"
                >
                    <motion.div
                        whileTap={{ scale: 1.4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                        style={liked ? { backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)' } : {}}
                    >
                        <Heart
                            size={19}
                            strokeWidth={liked ? 0 : 2}
                            style={{
                                color: liked ? 'var(--color-error)' : 'var(--color-text-muted)',
                                fill: liked ? 'var(--color-error)' : 'transparent',
                                transition: 'all 0.15s ease',
                            }}
                        />
                    </motion.div>
                    <span
                        className="text-[13px] font-semibold"
                        style={{ color: liked ? 'var(--color-error)' : 'var(--color-text-muted)' }}
                    >
                        {likesCount > 0 ? likesCount : ''}
                    </span>
                </button>

                {/* Comment */}
                <button className="flex flex-row items-center group outline-none">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full transition-colors">
                        <MessageCircle size={19} strokeWidth={2} style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                        {item?.commentsCount > 0 ? item.commentsCount : ''}
                    </span>
                </button>

                {/* Share */}
                <button className="ml-auto w-9 h-9 flex items-center justify-center rounded-full transition-colors outline-none">
                    <Share2 size={18} strokeWidth={2} style={{ color: 'var(--color-text-muted)' }} />
                </button>
            </div>
        </motion.div>
    );
};

export default memo(PostItem);
