import { motion } from 'framer-motion';
import { Mail, UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import PostItem from '../components/PostItem';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';

const Profile: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (userId) fetchProfile(); }, [userId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            setProfile({
                id: userId, name: 'John Doe', username: 'johndoe', avatar: null,
                bio: 'Digital Creator & Social Enthusiast. Passionate about building seamless experiences. 🌍✨'
            });
            setPosts([]);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleMessage = () => {
        if (!user || !profile) return;
        const sorted = [user.id, profile.id].sort();
        navigate(`/chat/${sorted.join('_')}`);
    };

    if (loading) return (
        <ScreenWrapper>
            <div className="flex flex-col h-full">
                <Header transparent title="Profile" />
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="spinner" />
                </div>
            </div>
        </ScreenWrapper>
    );

    const isOwnProfile = user?.id === userId;

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-full relative overflow-hidden">
                <Header transparent showBackButton={true} />

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Profile Header */}
                    <div className="px-6 pb-6 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20, delay: 0.1 }}
                            className="relative mt-4"
                        >
                            <div
                                className="absolute inset-0 blur-3xl rounded-full"
                                style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}
                            />
                            <Avatar uri={profile?.avatar} size={96} className="relative z-10" />
                        </motion.div>

                        <motion.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.2 }}
                            className="mt-4 flex flex-col items-center"
                        >
                            <h2 className="text-[24px] font-outfit font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
                                {profile?.name}
                            </h2>
                            <span className="text-[13px] font-bold uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
                                @{profile?.username}
                            </span>
                        </motion.div>

                        <motion.p
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.3 }}
                            className="mt-3 text-[14px] font-normal leading-relaxed max-w-xs"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {profile?.bio}
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.4 }}
                            className="flex flex-row items-center justify-center gap-10 mt-6 w-full"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-[20px] font-outfit font-black" style={{ color: 'var(--color-text)' }}>1.2k</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>Followers</span>
                            </div>
                            <div className="w-px h-7" style={{ backgroundColor: 'var(--color-border)' }} />
                            <div className="flex flex-col items-center">
                                <span className="text-[20px] font-outfit font-black" style={{ color: 'var(--color-text)' }}>482</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>Following</span>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.5 }}
                            className="flex flex-row gap-3 mt-6 w-full max-w-xs"
                        >
                            {!isOwnProfile ? (
                                <>
                                    <button
                                        className="flex-2 h-11 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-premium active-scale transition-all text-[14px]"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    >
                                        <UserPlus size={17} strokeWidth={2.5} />
                                        <span>Follow</span>
                                    </button>
                                    <button
                                        onClick={handleMessage}
                                        className="flex-1 h-11 rounded-xl flex items-center justify-center active-scale transition-all border"
                                        style={{ backgroundColor: 'var(--color-bg-subtle)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                    >
                                        <Mail size={18} strokeWidth={2} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/update-profile')}
                                    className="w-full h-11 rounded-xl font-bold text-[14px] active-scale transition-all border"
                                    style={{ backgroundColor: 'var(--color-bg-subtle)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Posts */}
                    <div className="border-t" style={{ borderColor: 'var(--color-separator)' }}>
                        <div className="px-4 py-3 flex flex-row items-center gap-3">
                            <h3 className="text-[11px] font-outfit font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>Posts</h3>
                            <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-separator)' }} />
                        </div>

                        {posts.length > 0 ? (
                            <div className="flex flex-col">
                                {posts.map((item, index) => (
                                    <PostItem key={item.id} item={item} currentUser={user} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center justify-center text-center px-10">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--color-separator)' }}>
                                    <span className="text-xl" style={{ opacity: 0.3 }}>📸</span>
                                </div>
                                <p className="text-[14px] font-medium" style={{ color: 'var(--color-text-muted)' }}>No posts yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Profile;