import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { BiSolidMessageRoundedDetail } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Feed from '../components/Feed';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
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
        setHasMore(true);
        loadFeed({ isLoadMore: false, loading, setLoading, refreshing, setRefreshing, hasMore, setHasMore, setPosts });
    }, []);

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-full relative">
                <Header
                    showBackButton={false}
                    centerElement={
                        <h1
                            className="text-[26px] font-outfit font-black tracking-tight"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Awaza
                        </h1>
                    }
                    rightElement={
                        <button
                            onClick={() => navigate('/inbox')}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all"
                        >
                            <BiSolidMessageRoundedDetail style={{ color: 'var(--color-primary)' }} size={24} />
                        </button>
                    }
                />

                <div className="flex-1 overflow-hidden relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                    >
                        <Feed data={posts} loading={loading} user={user} />
                    </motion.div>

                    {/* Floating Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
                        onClick={() => navigate('/compose-post')}
                        className="fixed bottom-6 right-4 w-14 h-14 rounded-full flex items-center justify-center text-white z-40 shadow-premium active:brightness-90 transition-all"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </motion.button>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Home;
