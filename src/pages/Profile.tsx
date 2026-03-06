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
                name: "John Doe",
                username: "johndoe",
                avatar: null,
                bio: "Digital Creator & Social Enthusiast. Passionate about building seamless experiences and connecting with the world. 🌍✨"
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
            <ScreenWrapper bg={colors.background}>
                <div className="flex flex-col h-full bg-white">
                    <Header transparent title="Profile" />
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px] font-bold opacity-30 uppercase tracking-widest">Loading Profile</span>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }

    const isOwnProfile = user?.id === userId;

    return (
        <ScreenWrapper bg={colors.background}>
            <div className="flex flex-col h-full bg-white relative overflow-hidden">
                <Header transparent title="" showBackButton={true} />

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Profile Header Section */}
                    <div className="px-8 pb-10 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20, delay: 0.1 }}
                            className="relative mt-2"
                        >
                            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                            <Avatar uri={profile?.avatar} size={110} rounded={40} className="relative z-10 border-4 border-white shadow-soft" />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 flex flex-col items-center"
                        >
                            <h2 className="text-3xl font-outfit font-black tracking-tight" style={{ color: colors.text }}>
                                {profile?.name}
                            </h2>
                            <span className="text-[15px] font-bold opacity-30 mt-1 uppercase tracking-wider">
                                @{profile?.username}
                            </span>
                        </motion.div>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-5 text-[16px] font-medium leading-[1.6] max-w-[320px] opacity-60"
                        >
                            {profile?.bio}
                        </motion.p>

                        {/* Stats Section */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-row items-center justify-center gap-12 mt-8 w-full"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-outfit font-black" style={{ color: colors.text }}>1.2k</span>
                                <span className="text-[11px] font-bold opacity-20 uppercase tracking-[0.2em] mt-1">Followers</span>
                            </div>
                            <div className="w-[1.5px] h-8 bg-gray-100" />
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-outfit font-black" style={{ color: colors.text }}>482</span>
                                <span className="text-[11px] font-bold opacity-20 uppercase tracking-[0.2em] mt-1">Following</span>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-row gap-4 mt-10 w-full max-w-[340px]"
                        >
                            {!isOwnProfile ? (
                                <>
                                    <button
                                        className="flex-[2] h-14 rounded-[20px] bg-primary text-white font-bold flex items-center justify-center gap-2.5 shadow-premium active-scale transition-all"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        <UserPlus size={20} strokeWidth={2.5} />
                                        <span>Follow</span>
                                    </button>
                                    <button
                                        onClick={handleMessage}
                                        className="flex-1 h-14 rounded-[20px] bg-gray-50 flex items-center justify-center text-gray-700 active-scale transition-all border border-gray-100"
                                    >
                                        <Mail size={22} strokeWidth={2} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/update-profile')}
                                    className="w-full h-14 rounded-[20px] bg-gray-50 border border-gray-100 font-bold text-[15px] opacity-70 hover:opacity-100 active-scale transition-all"
                                    style={{ color: colors.text }}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Posts List Section */}
                    <div className="bg-gray-50/30 rounded-t-[40px] px-0 mt-2 min-h-[400px]">
                        <div className="px-8 pt-10 pb-6 flex flex-row items-center justify-between">
                            <h3 className="text-[14px] font-outfit font-black uppercase tracking-[0.2em] opacity-30">Recent Posts</h3>
                            <div className="h-[2px] w-12 bg-primary/20 rounded-full" />
                        </div>

                        {posts.length > 0 ? (
                            <div className="flex flex-col">
                                {posts.map((item, index) => (
                                    <PostItem key={item.id} item={item} currentUser={user} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center px-12">
                                <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center shadow-soft mb-6">
                                    <span className="text-3xl opacity-30">📸</span>
                                </div>
                                <p className="text-[15px] font-medium opacity-30 italic">No posts captured yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Profile;
