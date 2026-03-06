import { motion } from 'framer-motion';
import { Plus, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Feed from '../components/Feed';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { loadFeed } from '../utils/feed';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Initial load
        setHasMore(true);
        loadFeed({
            isLoadMore: false,
            loading,
            setLoading,
            refreshing,
            setRefreshing,
            hasMore,
            setHasMore,
            setPosts,
        });
    }, []);

    return (
        <ScreenWrapper bg="white">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full bg-white relative"
            >
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex flex-row justify-between items-center px-6 py-4 border-b border-gray-50">
                    <h1 className="text-3xl font-black tracking-tighter" style={{ color: colors.primary }}>
                        Awaza
                    </h1>
                    <div className="flex flex-row items-center gap-4">
                        <button
                            onClick={() => navigate('/account-setting')}
                            className="hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            <Avatar uri={user?.avatar} size={38} rounded={19} />
                        </button>
                        <button
                            onClick={() => navigate('/inbox')}
                            className="p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all text-gray-700"
                        >
                            <Send size={22} />
                        </button>
                    </div>
                </header>

                {/* Feed container */}
                <div className="flex-1 overflow-hidden relative">
                    <Feed
                        data={posts}
                        loading={loading}
                        user={user}
                    />

                    {/* Floating Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/compose-post')}
                        className="absolute bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-xl text-white z-40"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Plus size={32} strokeWidth={2.5} />
                    </motion.button>
                </div>
            </motion.div>
        </ScreenWrapper>
    );
};

export default Home;
