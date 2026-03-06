import { motion } from 'framer-motion';
import { Heart, MessageCircle, MessageSquare, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { NestedComment } from '../components/home/NestedComment';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { getComments, likePost } from '../utils/actions';
import { buildCommentTree } from '../utils/buildCommentTree';
import { timeAgo } from '../utils/common';
import { getPost } from '../utils/post';

const PostDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentTree, setCommentTree] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const postId = id;

    const fetchData = async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const [postData, commentsData] = await Promise.all([
                getPost(postId),
                getComments(postId)
            ]);
            setPost(postData.post || postData);
            setComments(commentsData.comments || commentsData || []);
        } catch (error: any) {
            console.error("Error fetching post:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [postId]);

    useEffect(() => {
        if (comments.length > 0) {
            setCommentTree(buildCommentTree(comments));
        }
    }, [comments]);

    const handleLike = async () => {
        if (!post || !user) return;
        try {
            const userId = user.id;
            const alreadyLiked = post.likes?.includes(userId);

            setPost((p: any) => ({
                ...p,
                likes: alreadyLiked
                    ? p.likes.filter((l: string) => l !== userId)
                    : [...(p.likes || []), userId],
                likesCount: alreadyLiked ? p.likesCount - 1 : p.likesCount + 1,
            }));

            await likePost(postId!);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <ScreenWrapper bg={colors.background}>
                <div className="flex flex-col h-full bg-white">
                    <Header transparent title="Thread" showBackButton={true} />
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px] font-bold opacity-30 uppercase tracking-widest">Loading Thread</span>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }

    if (!post) {
        return (
            <ScreenWrapper bg={colors.background}>
                <div className="flex flex-col h-full bg-white">
                    <Header transparent title="Post" showBackButton={true} />
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-[20px] flex items-center justify-center mb-6">
                            <span className="text-3xl opacity-20">🔍</span>
                        </div>
                        <h3 className="text-xl font-outfit font-bold mb-2">Post not found</h3>
                        <p className="text-muted text-[15px]">This post may have been deleted or doesn't exist.</p>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }

    const isLiked = post.likes?.includes(user?.id);

    return (
        <ScreenWrapper bg={colors.background}>
            <div className="flex flex-col h-full bg-white relative overflow-hidden">
                <Header transparent title="Thread" showBackButton={true} />

                <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-4 pb-32">
                    {/* Main Post Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6 mb-12"
                    >
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center gap-4">
                                <Avatar
                                    uri={post.user?.avatar}
                                    size={52}
                                    rounded={20}
                                    onClick={() => navigate(`/profile/${post.user?._id || post.user?.id}`)}
                                />
                                <div className="flex flex-col">
                                    <span
                                        className="font-outfit font-black text-[18px] tracking-tight leading-none mb-1 cursor-pointer hover:text-primary transition-colors"
                                        style={{ color: colors.text }}
                                        onClick={() => navigate(`/profile/${post.user?._id || post.user?.id}`)}
                                    >
                                        {post.user?.name}
                                    </span>
                                    <span className="text-sm font-bold opacity-30 uppercase tracking-tight">
                                        @{post.user?.username?.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold opacity-20 uppercase tracking-[0.1em] bg-gray-50 px-3 py-1.5 rounded-full">
                                {timeAgo(post.createdAt)}
                            </span>
                        </div>

                        <p className="text-[18px] font-medium leading-[1.6]" style={{ color: colors.textLight }}>
                            {post.content}
                        </p>

                        {post.image && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-[32px] overflow-hidden shadow-premium border border-gray-100/50"
                            >
                                <img src={post.image} alt="Post Content" className="w-full h-auto" />
                            </motion.div>
                        )}

                        <div className="flex flex-row items-center justify-between pt-6 border-t border-gray-50/50">
                            <div className="flex flex-row items-center gap-8">
                                <button
                                    onClick={handleLike}
                                    className="flex flex-row items-center gap-2.5 active-scale group"
                                >
                                    <Heart
                                        size={24}
                                        strokeWidth={isLiked ? 0 : 2.5}
                                        className={`transition-all ${isLiked ? 'fill-error scale-110' : 'text-gray-300 group-hover:text-error'}`}
                                        style={{ color: isLiked ? colors.error : undefined }}
                                    />
                                    <span className={`text-[15px] font-bold ${isLiked ? 'text-error' : 'opacity-30'}`}>
                                        {post.likesCount || 0}
                                    </span>
                                </button>
                                <div className="flex flex-row items-center gap-2.5 opacity-30">
                                    <MessageSquare size={24} strokeWidth={2.5} style={{ color: colors.textMuted }} />
                                    <span className="text-[15px] font-bold">{post.commentsCount || 0}</span>
                                </div>
                            </div>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active-scale group transition-all text-gray-300">
                                <Share2 size={24} strokeWidth={2.5} className="group-hover:text-gray-600" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Comments Section */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-[14px] font-outfit font-black uppercase tracking-[0.2em] opacity-30">Replies</h2>
                            <div className="h-[2px] w-12 bg-primary/20 rounded-full" />
                        </div>

                        {commentTree.length > 0 ? (
                            <div className="flex flex-col">
                                {commentTree.map((rootComment) => (
                                    <NestedComment
                                        key={rootComment._id}
                                        comment={rootComment}
                                        postId={postId!}
                                        currentUserId={user?.id}
                                        depth={0}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center px-12">
                                <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center mb-6">
                                    <MessageCircle size={32} className="opacity-20" />
                                </div>
                                <h4 className="text-[16px] font-bold mb-2">Be the first to reply</h4>
                                <p className="text-[14px] font-medium opacity-30 italic">Start the conversation below</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reply FAB */}
                <motion.button
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                    onClick={() => navigate(`/comment/${postId}`)}
                    className="absolute bottom-10 right-8 w-16 h-16 rounded-[24px] flex items-center justify-center shadow-premium text-white z-50 active:brightness-90 transition-all"
                    style={{ backgroundColor: colors.primary }}
                >
                    <MessageSquare size={28} fill="currentColor" />
                </motion.button>
            </div>
        </ScreenWrapper>
    );
};

export default PostDetails;
