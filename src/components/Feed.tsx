/**
 * @file Feed.tsx
 * @description Scrollable list of PostItem cards for the Home screen.
 *
 * Handles three states:
 *  1. **Loading** — shows a centred spinner with a subtle label
 *  2. **Empty** — shows an illustrated empty-state card
 *  3. **Populated** — maps posts to `PostItem` components
 */

import React from 'react';
import PostItem from './PostItem';

/** Props for the Feed component */
interface FeedProps {
    /** Array of post objects to display */
    data: any[];
    /** When true a loading spinner is shown at the bottom edge */
    loading?: boolean;
    /** The authenticated user passed through to PostItem for liked state */
    user?: any;
    /** Optional callback when a post is deleted */
    onDelete?: (postId: string) => void;
}

/**
 * Feed
 *
 * Uses `no-scrollbar` to hide the native scrollbar on all platforms while
 * floating action button so the last post is always reachable.
 */
const Feed: React.FC<FeedProps> = ({ data, loading = false, user, onDelete }) => {
    const isEmpty = data.length === 0 && !loading;

    return (
        <div
            className="flex-1 overflow-y-auto no-scrollbar h-full pb-8"
        >
            {/* ── Empty state ── */}
            {isEmpty && (
                <div className="flex flex-col items-center justify-center pt-20 px-10 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-separator">
                        <span className="text-3xl">👋</span>
                    </div>

                    <h3 className="text-[17px] font-outfit font-bold mb-1.5 text-app">
                        Welcome to your feed!
                    </h3>

                    <p className="text-[14px] font-medium leading-relaxed text-muted">
                        Start following people or create your first post.
                    </p>
                </div>
            )}

            {/* ── Post list ── */}
            <div className="flex flex-col">
                {data.map((item, index) => (
                    <PostItem
                        key={item?._id || item?.id || index}
                        item={item}
                        currentUser={user}
                        index={index}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* ── Bottom loading spinner ── */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="spinner" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted opacity-50">
                        Loading
                    </span>
                </div>
            )}
        </div>
    );
};

export default Feed;
