import { Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Feed from '../components/Feed';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { loadFeed } from '../utils/feed';
import { getProfileInfo } from '../utils/getProfile';

const Profile: React.FC = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [feedLoading, setFeedLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        if (username) {
            fetchProfile();
            // Load feed for this user - using the same logic as Home
            loadFeed({
                isLoadMore: false,
                loading: feedLoading,
                setLoading: setFeedLoading,
                refreshing,
                setRefreshing,
                hasMore,
                setHasMore,
                cursor,
                setCursor,
                setTotalPosts,
                setPosts,
                isProfile: true,
                username: username,
            });
        }
    }, [username]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const profile = await getProfileInfo({username: username!});
            console.log("Profile info:", profile);
            // Mocking profile data based on username
            setProfile({
                id: profile?.id,
                name: (username ? (username.split('.')[0].charAt(0).toUpperCase() + username.split('.')[0].slice(1)) : 'User'),
                username: username,
                avatar: profile?.avatar,
                banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop', 
                bio: profile?.bio,
                followersCount: profile?.followersCount,
                followingCount: profile?.followingCount,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) return (
        <ScreenWrapper>
            <div className="flex items-center justify-center h-full">
                <div className="spinner" />
            </div>
        </ScreenWrapper>
    );

    const isOwnProfile = user?.username === (username || '');

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-full bg-white relative">
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Banner */}
                    <div className="h-24 w-full bg-gray-200 relative">
                        {profile?.banner && (
                            <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />
                        )}
                    </div>

                    {/* Profile Info Section */}
                    <div className="px-3 pb-4">
                        <div className="relative flex justify-between items-end mb-3">
                            <div className="bg-white rounded-full -mt-10">
                                <Avatar uri={profile?.avatar} size={80} className="sm:w-28 sm:h-28" />
                            </div>
                            
                            <div className="transform translate-y-2">
                                {isOwnProfile ? (
                                    <button 
                                        onClick={() => navigate('/update-profile')}
                                        className="px-4 h-8 rounded-full border border-gray-700 font-bold text-[14px] hover:bg-gray-50 transition-colors"
                                    >
                                        Edit profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                                            <Mail size={18} />
                                        </button>
                                        <button className="px-5 h-8 rounded-full bg-black text-white font-bold text-[14px] hover:bg-black/90 transition-colors">
                                            Follow
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-2">
                            <h2 className="text-xl font-black tracking-tight leading-tight">{profile?.name}</h2>
                            <p className="text-gray-500 text-[15px]">@{profile?.username}</p>
                        </div>

                        <p className="mt-3 text-[15px] leading-normal">{profile?.bio}</p>

                        <div className="flex gap-4 mt-3">
                            <button className="hover:underline">
                                <span className="font-bold text-[14px]">{profile?.followingCount}</span>
                                <span className="text-gray-500 text-[14px] ml-1">Following</span>
                            </button>
                            <button className="hover:underline">
                                <span className="font-bold text-[14px]">{profile?.followersCount}</span>
                                <span className="text-gray-500 text-[14px] ml-1">Followers</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-start border-b border-gray-100 mb-4">
                        {['Posts', 'Replies', 'Likes'].map((tab, i) => (
                            <button 
                                key={tab} 
                                className={`px-4 py-2 text-[15px] font-bold hover:bg-black/5 transition-colors relative ${i === 0 ? '' : 'text-gray-500'}`}
                            >
                                {tab}
                                {tab == 'Posts' && <span className='text-gray-400 text-xs ps-2'>{totalPosts}</span>}
                                {i === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-18 h-[3px] bg-primary rounded-full" />}
                            </button>
                        ))}
                    </div>

                    {/* Feed */}
                    <div className="min-h-screen">
                        <Feed data={posts} loading={feedLoading} user={user} />
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Profile;