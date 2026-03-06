import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Feed from '../components/Feed';
import Header from '../components/Header';
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
        <ScreenWrapper bg={colors.background}>
            <div className="flex flex-col h-full bg-white relative overflow-hidden">
                {/* Premium Header */}
                <Header
                    showBackButton={false}
                    centerElement={
                        <h1 className="text-4xl font-outfit font-black tracking-tighter" style={{ color: colors.primary }}>
                            Awaza
                        </h1>
                    }
                    rightElement={
                        <div className="flex flex-row items-center gap-3">
                            <button
                                onClick={() => navigate('/inbox')}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all text-gray-700"
                            >
                                <BiSolidMessageRoundedDetail style={{color: colors.primary}} size={30}/>
                            </button>
                        </div>
                    }
                />

                {/* Feed container */}
                <div className="flex-1 overflow-hidden relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                    >
                        <Feed
                            data={posts}
                            loading={loading}
                            user={user}
                        />
                    </motion.div>

                    {/* Floating Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                        onClick={() => navigate('/compose-post')}
                        className="fixed bottom-8 right-3 w-14 h-14 rounded-full flex items-center justify-center shadow-premium text-white z-40 active:brightness-90 transition-all"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <Plus size={26} strokeWidth={3} />
                    </motion.button>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Home;
