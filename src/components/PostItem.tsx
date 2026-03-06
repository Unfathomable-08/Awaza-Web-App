import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/Colors';
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
            console.error("Failed to like post", error);
        }
    };

    const createdAt = timeAgo(item?.createdAt || new Date().toISOString());

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={openPostDetails}
            className="flex flex-col bg-white border-b border-gray-100/50 p-2 cursor-pointer active:bg-gray-50/50 transition-colors"
        >
            {/* User Info Header */}
            <div className="flex flex-row justify-between items-center mb-3">
                <div className="flex flex-row items-center gap-3">
                    <Avatar
                        size={44}
                        uri={item?.user?.avatar}
                        rounded={18}
                        onClick={() => navigate(`/profile/${item?.user?._id || item?.user?.id}`)}
                    />
                    <div className="flex flex-col">
                        <span
                            className="font-outfit font-bold tracking-tight leading-none mb-1 hover:text-primary transition-colors"
                            style={{ color: colors.text }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${item?.user?._id || item?.user?.id}`);
                            }}
                        >
                            {item?.user?.name}
                        </span>
                        <span className="text-xs font-medium opacity-40" style={{ color: colors.text }}>
                            {createdAt}
                        </span>
                    </div>
                </div>

                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all">
                    <MoreHorizontal size={20} className="opacity-40" />
                </button>
            </div>

            {/* Post Content */}
            <div className="flex flex-col gap-4 mb-1">
                {item?.content && (
                    <p className="text-[16px] leading-[1.6] font-medium" style={{ color: colors.textLight }}>
                        {item?.content}
                    </p>
                )}

                {item?.image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100/50 shadow-soft"
                    >
                        <img
                            src={item?.image}
                            alt="Post Content"
                            className="w-full h-auto object-cover max-h-125"
                            loading="lazy"
                        />
                    </motion.div>
                )}
            </div>

            {/* Interaction Footer */}
            <div className="flex flex-row items-center gap-2">
                <button
                    onClick={handleLike}
                    className="flex flex-row items-center group outline-none"
                >
                    <motion.div
                        whileTap={{ scale: 1.4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${liked ? 'bg-error/5' : 'group-hover:bg-error/5'}`}
                    >
                        <Heart
                            size={22}
                            strokeWidth={liked ? 0 : 2.5}
                            className={`transition-all ${liked ? 'fill-error scale-110' : 'group-hover:stroke-error'}`}
                            style={{ color: liked ? colors.error : colors.textMuted }}
                        />
                    </motion.div>
                    <span
                        className={`text-sm font-bold transition-colors ${liked ? 'text-error' : 'opacity-40 group-hover:opacity-100'}`}
                        style={{ color: liked ? colors.error : colors.text }}
                    >
                        {likesCount}
                    </span>
                </button>

                <button className="flex flex-row items-center group outline-none">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-info/5 transition-colors">
                        <MessageCircle size={22} strokeWidth={2.5} className="group-hover:stroke-info transition-colors" style={{ color: colors.textMuted }} />
                    </div>
                    <span className="text-sm font-bold opacity-40 group-hover:opacity-100 transition-colors" style={{ color: colors.text }}>
                        {item?.commentsCount || 0}
                    </span>
                </button>

                <button className="ml-auto w-10 h-10 flex items-center justify-center rounded-full hover:bg-success/5 group transition-colors outline-none">
                    <Share2 size={22} strokeWidth={2.5} className="group-hover:stroke-success transition-colors" style={{ color: colors.textMuted }} />
                </button>
            </div>
        </motion.div>
    );
};

export default memo(PostItem);
