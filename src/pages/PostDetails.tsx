/**
 * @file PostDetails.tsx
 * @description Displays a single post thread including its contents, author details,
 * and a real-time nested comment section.
 *
 * Features:
 *  - Fetches post details and comments concurrently
 *  - Renders a recursive comment tree
 *  - Like and Share action buttons
 *  - Floating Action Button (FAB) to reply to the main post
 */

import { motion } from 'framer-motion';
import { Heart, MessageCircle, MessageSquare, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { NestedComment } from '../components/NestedComment';
import { useAuth } from '../contexts/authContext';
import { getComments, likePost } from '../utils/actions';
import { buildCommentTree } from '../utils/buildCommentTree';
import { timeAgo } from '../utils/common';
import { getPost } from '../utils/post';

/**
 * PostDetails
 *
 * Fetches and displays a specific post and its descendants (comments).
 */
const PostDetails: React.FC = () => {
    // ── Route & Auth State ───────────────────────────────────────────────
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // ── Data State ───────────────────────────────────────────────────────
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentTree, setCommentTree] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const postId = id;

    /** Fetch post data and its comments concurrently */
    const fetchData = async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const [postData, commentsData] = await Promise.all([getPost(postId), getComments(postId)]);
            setPost(postData.post || postData);
            setComments(commentsData.comments || commentsData || []);
        } catch (error: any) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [postId]);
    useEffect(() => { if (comments.length > 0) setCommentTree(buildCommentTree(comments)); }, [comments]);

    /** Optimistically handle the like action for the current post */
    const handleLike = async () => {
        if (!post || !user) return;
        const userId = user.id;
        const alreadyLiked = post.likes?.includes(userId);
        setPost((p: any) => ({
            ...p,
            likes: alreadyLiked ? p.likes.filter((l: string) => l !== userId) : [...(p.likes || []), userId],
            likesCount: alreadyLiked ? p.likesCount - 1 : p.likesCount + 1,
        }));
        try { await likePost(postId!); } catch (err) { console.error(err); }
    };

    // ── Render Helpers ───────────────────────────────────────────────────

    if (loading) return (
        <ScreenWrapper>
            <div className="flex flex-col h-full">
                <Header transparent title="Thread" />
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="spinner" />
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>Loading</span>
                </div>
            </div>
        </ScreenWrapper>
    );

    if (!post) return (
        <ScreenWrapper>
            <div className="flex flex-col h-full">
                <Header transparent title="Post" />
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-separator)' }}>
                        <span className="text-2xl opacity-30">🔍</span>
                    </div>
                    <h3 className="text-[16px] font-bold mb-1" style={{ color: 'var(--color-text)' }}>Post not found</h3>
                    <p className="text-[14px]" style={{ color: 'var(--color-text-muted)' }}>This post may have been deleted.</p>
                </div>
            </div>
        </ScreenWrapper>
    );

    const isLiked = post.likes?.includes(user?.id);

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-full relative overflow-hidden">
                <Header transparent title="Thread" />

                <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4" style={{ paddingBottom: '88px' }}>
                    {/* ── Main Post ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4 mb-8"
                    >
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center gap-3">
                                <Avatar uri={post.user?.avatar} size={44} onClick={() => navigate(`/profile/${post.user?.username}`)} />
                                <div className="flex flex-col">
                                    <span
                                        className="font-outfit font-black text-[16px] tracking-tight leading-none mb-1 cursor-pointer hover:text-primary transition-colors"
                                        style={{ color: 'var(--color-text)' }}
                                        onClick={() => navigate(`/profile/${post.user?.username}`)}
                                    >
                                        {post.user?.name}
                                    </span>
                                    <span className="text-[12px] font-semibold uppercase tracking-tight" style={{ color: 'var(--color-text-muted)', opacity: 1 }}>
                                        @{post.user?.username?.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                            <span
                                className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                                style={{ backgroundColor: 'var(--color-separator)', color: 'var(--color-text-muted)' }}
                            >
                                {timeAgo(post.createdAt)}
                            </span>
                        </div>

                        <p className="text-[16px] font-normal leading-[1.6]" style={{ color: 'var(--color-text-light)' }}>
                            {post.content}
                        </p>

                        {post.image && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-2xl overflow-hidden shadow-soft border"
                                style={{ borderColor: 'var(--color-card-border)' }}
                            >
                                <img src={post.image} alt="Post Content" className="w-full h-auto" />
                            </motion.div>
                        )}

                        {/* ── Actions row ── */}
                        <div className="flex flex-row items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-separator)' }}>
                            <div className="flex flex-row items-center gap-6">
                                <button onClick={handleLike} className="flex flex-row items-center gap-2 active-scale group">
                                    <Heart
                                        size={22}
                                        strokeWidth={isLiked ? 0 : 2}
                                        style={{
                                            color: isLiked ? 'var(--color-error)' : 'var(--color-text-muted)',
                                            fill: isLiked ? 'var(--color-error)' : 'transparent',
                                        }}
                                    />
                                    <span className="text-[15px] font-bold" style={{ color: isLiked ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
                                        {post.likesCount || 0}
                                    </span>
                                </button>
                                <div className="flex flex-row items-center gap-2">
                                    <MessageSquare size={22} strokeWidth={2} style={{ color: 'var(--color-text-muted)' }} />
                                    <span className="text-[15px] font-bold" style={{ color: 'var(--color-text-muted)' }}>{post.commentsCount || 0}</span>
                                </div>
                            </div>
                            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active-scale transition-all">
                                <Share2 size={20} strokeWidth={2} style={{ color: 'var(--color-text-muted)' }} />
                            </button>
                        </div>
                    </motion.div>

                    {/* ── Comments Section ── */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-[12px] font-outfit font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>Replies</h2>
                            <div className="h-px flex-1 ml-4" style={{ backgroundColor: 'var(--color-separator)' }} />
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
                            <div className="py-16 flex flex-col items-center justify-center text-center px-10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-separator)' }}>
                                    <MessageCircle size={28} style={{ color: 'var(--color-text-muted)' }} />
                                </div>
                                <h4 className="text-[15px] font-bold mb-1" style={{ color: 'var(--color-text)' }}>Be the first to reply</h4>
                                <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>Start the conversation below</p>
                            </div>
                        )}
                    </div>
                </div >

                {/* ── Reply FAB ── */}
                < motion.button
                    initial={{ scale: 0, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
                    onClick={() => navigate(`/comment/${postId}`)}
                    className="fixed bottom-6 right-4 w-14 h-14 rounded-2xl flex items-center justify-center text-white z-50 shadow-premium active:brightness-90 transition-all"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                >
                    <MessageSquare size={22} fill="currentColor" />
                </motion.button >
            </div >
        </ScreenWrapper >
    );
};

export default PostDetails;