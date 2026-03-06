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
    hasShadow?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ item, currentUser }) => {
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={openPostDetails}
            className={`
                bg-white border-b border-gray-100 p-5 cursor-pointer
                active:bg-gray-50/50 transition-colors
            `}
        >
            {/* Header */}
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row items-center gap-3">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${item?.user?._id || item?.user?.id}`);
                        }}
                        className="cursor-pointer active:scale-95 transition-all"
                    >
                        <Avatar
                            size={40}
                            uri={item?.user?.avatar}
                            rounded={14}
                        />
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${item?.user?._id || item?.user?.id}`);
                        }}
                        className="flex flex-col cursor-pointer"
                    >
                        <span className="text-[16px] font-bold hover:underline" style={{ color: colors.text }}>
                            {item?.user?.name}
                        </span>
                        <span className="text-[13px] opacity-60" style={{ color: colors.textMuted }}>
                            {createdAt}
                        </span>
                    </div>
                </div>

                <button className="p-2 hover:bg-gray-50 active:scale-90 rounded-full transition-all">
                    <MoreHorizontal size={20} color={colors.textLight} />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 mb-4">
                <p className="text-[16px] leading-relaxed" style={{ color: colors.text }}>
                    {item?.content}
                </p>
                {item?.image && (
                    <div className="w-full rounded-2xl overflow-hidden mt-1 bg-gray-50 aspect-square sm:aspect-video">
                        <img
                            src={item?.image}
                            alt="Post"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-row items-center gap-7 pt-2">
                <button
                    onClick={handleLike}
                    className="flex flex-row items-center gap-2 group transition-colors"
                >
                    <motion.div
                        whileTap={{ scale: 1.4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Heart
                            size={22}
                            className={`transition-all ${liked ? 'fill-primary stroke-primary' : 'stroke-gray-400 group-hover:stroke-primary'}`}
                            style={{ color: liked ? colors.primary : undefined }}
                        />
                    </motion.div>
                    <span
                        className={`text-sm font-semibold ${liked ? 'text-primary' : 'text-gray-500'}`}
                        style={{ color: liked ? colors.primary : undefined }}
                    >
                        {likesCount}
                    </span>
                </button>

                <button className="flex flex-row items-center gap-2 group transition-colors">
                    <MessageCircle size={22} className="stroke-gray-400 group-hover:stroke-blue-500" />
                    <span className="text-sm font-semibold text-gray-500">
                        {item?.commentsCount || 0}
                    </span>
                </button>

                <button className="group transition-colors ml-auto">
                    <Share2 size={22} className="stroke-gray-400 group-hover:stroke-green-500" />
                </button>
            </div>
        </motion.div>
    );
};

export default memo(PostItem);
