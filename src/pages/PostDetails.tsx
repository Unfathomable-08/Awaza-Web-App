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
            <ScreenWrapper bg="white">
                <div className="flex flex-col min-h-full">
                    <Header title="Post" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }

    if (!post) {
        return (
            <ScreenWrapper bg="white">
                <div className="flex flex-col min-h-full">
                    <Header title="Post" />
                    <div className="flex-1 flex items-center justify-center p-10 text-center">
                        <p className="text-lg font-bold opacity-40">Post not found</p>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }

    const isLiked = post.likes?.includes(user?.id);

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-screen">
                <Header title="Post" />

                <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
                    {/* Main Post Section */}
                    <div className="flex flex-col gap-6 mb-10">
                        <div className="flex flex-row items-center gap-4">
                            <button className="active:scale-95 transition-all">
                                <Avatar uri={post.user?.avatar} size={50} rounded={18} />
                            </button>
                            <div className="flex-1 flex flex-col items-start overflow-hidden">
                                <span className="font-bold text-[18px] truncate" style={{ color: colors.text }}>
                                    {post.user?.name}
                                </span>
                                <span className="text-sm font-bold opacity-30">
                                    @{post.user?.username?.toLowerCase()}
                                </span>
                            </div>
                            <span className="text-xs font-black opacity-20 uppercase tracking-tighter">
                                {timeAgo(post.createdAt)}
                            </span>
                        </div>

                        <p className="text-[17px] font-medium leading-[1.6]" style={{ color: colors.text }}>
                            {post.content}
                        </p>

                        {post.image && (
                            <div className="rounded-[32px] overflow-hidden shadow-2xl">
                                <img src={post.image} alt="Post" className="w-full h-auto" />
                            </div>
                        )}

                        <div className="flex flex-row items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex flex-row items-center gap-6">
                                <button
                                    onClick={handleLike}
                                    className="flex flex-row items-center gap-1.5 active:scale-90 transition-all group"
                                >
                                    <Heart
                                        size={22}
                                        className={`transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-300 group-hover:text-rose-400'}`}
                                    />
                                    <span className={`text-sm font-black ${isLiked ? 'text-rose-500' : 'opacity-20'}`}>
                                        {post.likesCount || 0}
                                    </span>
                                </button>
                                <div className="flex flex-row items-center gap-1.5 opacity-20">
                                    <MessageSquare size={22} className="text-gray-300" />
                                    <span className="text-sm font-black">{post.commentsCount || 0}</span>
                                </div>
                            </div>
                            <button className="text-gray-300 hover:text-gray-600 active:rotate-12 transition-all">
                                <Share2 size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-row items-center gap-3">
                            <h2 className="text-xl font-black" style={{ color: colors.text }}>Replies</h2>
                            <div className="flex-1 h-[1.5px] bg-gray-50" />
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
                            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                <MessageCircle size={60} strokeWidth={1} />
                                <p className="mt-4 font-bold">No replies yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reply FAB */}
                <button
                    onClick={() => navigate(`/comment/${postId}`)}
                    className="fixed bottom-8 right-8 w-16 h-16 rounded-[24px] bg-primary text-white flex items-center justify-center shadow-2xl active:scale-90 transition-all z-50 hover:shadow-primary/30"
                    style={{ backgroundColor: colors.primary }}
                >
                    <MessageSquare size={28} fill="currentColor" />
                </button>
            </div>
        </ScreenWrapper>
    );
};

export default PostDetails;
