import React from 'react';
import PostItem from './PostItem';

interface FeedProps {
    data: any[];
    loading?: boolean;
    user?: any;
}

const Feed: React.FC<FeedProps> = ({ data, loading = false, user }) => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar h-full" style={{ paddingBottom: '88px' }}>
            {data.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center pt-20 px-10 text-center">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: 'var(--color-separator)' }}
                    >
                        <span className="text-3xl">👋</span>
                    </div>
                    <h3
                        className="text-[17px] font-outfit font-bold mb-1.5"
                        style={{ color: 'var(--color-text)' }}
                    >
                        Welcome to your feed!
                    </h3>
                    <p
                        className="text-[14px] font-medium leading-relaxed"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Start following people or create your first post.
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
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="spinner" />
                    <span
                        className="text-[11px] font-bold uppercase tracking-widest"
                        style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
                    >
                        Loading
                    </span>
                </div>
            )}
        </div>
    );
};

export default Feed;
