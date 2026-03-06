import React from 'react';
import PostItem from './PostItem';

interface FeedProps {
    data: any[];
    loading?: boolean;
    user?: any;
}

const Feed: React.FC<FeedProps> = ({ data, loading = false, user }) => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 h-full">
            {data.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center pt-20 px-10 text-center">
                    <p className="text-gray-400 text-lg">No posts yet. Be the first to share something!</p>
                </div>
            )}

            <div className="flex flex-col">
                {data.map((item, index) => (
                    <PostItem
                        key={item?._id || item?.id || index}
                        item={item}
                        currentUser={user}
                    />
                ))}
            </div>

            {loading && (
                <div className="flex justify-center p-6">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default Feed;
