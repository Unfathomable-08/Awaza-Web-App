import React from 'react';
import PostItem from './PostItem';

interface FeedProps {
    data: any[];
    loading?: boolean;
    user?: any;
}

const Feed: React.FC<FeedProps> = ({ data, loading = false, user }) => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 h-full">
            {data.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center pt-24 px-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl text-gray-300">👋</span>
                    </div>
                    <h3 className="text-xl font-outfit font-bold mb-2">Welcome to your feed!</h3>
                    <p className="text-muted text-[15px] leading-relaxed">
                        Start following people or create your first post to see what's happening.
                    </p>
                </div>
            )}

            <div className="flex flex-col">
                {data.map((item, index) => (
                    <PostItem
                        key={item?._id || item?.id || index}
                        item={item}
                        currentUser={user}
                        index={index}
                    />
                ))}
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center p-12 gap-4">
                    <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[13px] font-bold opacity-30 uppercase tracking-widest">Loading Feed</span>
                </div>
            )}
        </div>
    );
};

export default Feed;
