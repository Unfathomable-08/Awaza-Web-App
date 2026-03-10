/**
 * @file Home.tsx
 * @description Main authenticated feed page.
 *
 * Shows the `Feed` list of posts and a floating action button (FAB) for
 * composing new posts.  The header includes a messages shortcut.
 *
 * Data flow:
 *  - `loadFeed()` is called on mount to populate `posts`
 *  - `Feed` handles its own scroll and loading indicator
 */

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { RiMailSendFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Feed from '../components/Feed';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { loadFeed } from '../utils/feed';

/**
 * Home
 *
 * The FAB is `position: fixed` so it floats over the scrollable feed.
 * It springs in with a delay to avoid fighting the feed entrance animation.
 */
const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // ── Feed state ───────────────────────────────────────────────────────
    const [posts, setPosts] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    /** Load the initial page of posts on mount */
    useEffect(() => {
        if (loading || !hasMore || refreshing) return;
        loadFeed({
            isLoadMore: page > 1 ? true : false,
            loading, 
            setLoading,
            refreshing, 
            setRefreshing,
            hasMore, 
            setHasMore,
            cursor,
            setCursor,
            setPosts,
        });
    }, [page]);

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-full relative">
                {/* ── App header ── */}
                <Header
                    showBackButton={false}
                    centerElement={
                        /* Brand logo in the header centre slot */
                        <h1 className="text-[26px] font-outfit font-black tracking-tight text-primary">
                            Awaza
                        </h1>
                    }
                    rightElement={
                        /* Inbox shortcut icon */
                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={() => navigate('/profile')}
                                aria-label="Profile"
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all"
                            >
                                <FaUserEdit className="text-primary" size={24} />
                            </button>
                            <button
                                onClick={() => navigate('/inbox')}
                                aria-label="Messages"
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all"
                            >
                                <RiMailSendFill className="text-primary" size={24} />
                            </button>
                        </div>
                    }
                />

                {/* ── Feed ── */}
                <div className="flex-1 overflow-hidden relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                    >
                        <Feed data={posts} loading={loading} user={user} />
                    </motion.div>

                    {/* ── Floating action button (compose post) ── */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
                        onClick={() => navigate('/compose-post')}
                        aria-label="Compose new post"
                        className="
                            fixed bottom-6 right-4 z-40
                            w-14 h-14 rounded-full
                            flex items-center justify-center
                            text-white bg-primary
                            shadow-premium active:brightness-90 transition-all
                        "
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </motion.button>
                </div>
            </div>

            {/* Infinite Scroll Trigger */}
            <motion.div
                className="flex justify-center items-center min-h-25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onViewportEnter={() => {
                    if (hasMore && !loading) {
                        setPage((prev) => prev + 1);
                    }
                }}
            >
                {!hasMore && <p className="text-gray-500">No More Posts</p>}
            </motion.div>
        </ScreenWrapper>
    );
};

export default Home;
