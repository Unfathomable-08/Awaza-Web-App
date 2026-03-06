import { motion } from 'framer-motion';
import { Mail, UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import PostItem from '../components/PostItem';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';

const Profile: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Current logged in user
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            // Mock data as in original RN code
            setProfile({
                id: userId,
                name: "User Name",
                username: "username",
                avatar: null,
                bio: "This is a bio. Welcome to my profile! I love sharing moments and connecting with people."
            });
            setPosts([]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = () => {
        if (!user || !profile) return;
        const sorted = [user.id, profile.id].sort();
        const chatSlug = sorted.join("_");
        navigate(`/chat/${chatSlug}`);
    };

    if (loading) {
        return (
            <ScreenWrapper bg="white">
                <div className="flex flex-col min-h-full">
                    <Header title="Profile" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }

    const isOwnProfile = user?.id === userId;

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-screen">
                <Header title="Profile" />

                <div className="flex-1 overflow-y-auto">
                    {/* Profile Header Block */}
                    <div className="px-6 py-8 flex flex-col items-center text-center border-b border-gray-50 bg-gradient-to-b from-transparent to-gray-50/30">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20 }}
                        >
                            <Avatar uri={profile?.avatar} size={100} rounded={32} />
                        </motion.div>

                        <h2 className="mt-6 text-2xl font-black" style={{ color: colors.text }}>{profile?.name}</h2>
                        <span className="text-sm font-bold opacity-30 mt-1">@{profile?.username}</span>

                        <p className="mt-4 text-[15px] font-medium leading-relaxed max-w-xs opacity-60">
                            {profile?.bio}
                        </p>

                        <div className="flex flex-row gap-8 mt-8">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-black" style={{ color: colors.text }}>0</span>
                                <span className="text-xs font-bold opacity-20 uppercase tracking-widest">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-black" style={{ color: colors.text }}>0</span>
                                <span className="text-xs font-bold opacity-20 uppercase tracking-widest">Following</span>
                            </div>
                        </div>

                        {!isOwnProfile && (
                            <div className="flex flex-row gap-4 mt-10 w-full max-w-[300px]">
                                <button
                                    className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <UserPlus size={20} />
                                    Follow
                                </button>
                                <button
                                    onClick={handleMessage}
                                    className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-all border border-gray-200"
                                >
                                    <Mail size={20} />
                                </button>
                            </div>
                        )}

                        {isOwnProfile && (
                            <button
                                onClick={() => navigate('/update-profile')}
                                className="mt-10 w-full max-w-[200px] h-12 rounded-xl border border-gray-200 font-bold text-sm opacity-60 hover:opacity-100 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Posts List */}
                    <div className="px-6 py-6 pb-20">
                        <div className="flex flex-row items-center gap-3 mb-6">
                            <h3 className="text-[17px] font-black uppercase tracking-widest opacity-20">Posts</h3>
                            <div className="flex-1 h-[1.5px] bg-gray-50" />
                        </div>

                        {posts.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {posts.map((item) => (
                                    <PostItem key={item.id} item={item} currentUser={user} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 italic font-medium">
                                <p>No posts yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Profile;
