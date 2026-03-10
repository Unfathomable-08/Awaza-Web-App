import { motion } from 'framer-motion';
import React from 'react';
import { timeAgo } from '../utils/common';
import Avatar from './Avatar';

interface CommentProps {
    item: any;
    onReply?: (item: any) => void;
    canDelete?: boolean;
    onDelete?: (id: string) => void;
}

const CommentItem: React.FC<CommentProps> = ({ item, onReply, canDelete, onDelete }) => {
    const createdAt = timeAgo(item?.createdAt || new Date().toISOString());

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-row px-4 py-3 gap-3 border-b last:border-b-0"
            style={{ borderColor: 'var(--color-separator)' }}
        >
            <Avatar uri={item?.user?.image || item?.user?.avatar} size={34} />
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex flex-row items-center gap-1.5">
                    <span
                        className="font-bold text-[14px]"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {item?.user?.name}
                    </span>
                    <span
                        className="text-[12px]"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        · {createdAt}
                    </span>
                </div>
                <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: 'var(--color-text-light)' }}
                >
                    {item?.content}
                </p>

                {(onReply || canDelete) && (
                    <div className="flex flex-row gap-4 mt-1">
                        {onReply && (
                            <button
                                onClick={() => onReply(item)}
                                className="text-[12px] font-bold hover:opacity-70 active:scale-95 transition-all"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Reply
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => onDelete && onDelete(item?._id || item?.id)}
                                className="text-[12px] font-bold hover:opacity-70 active:scale-95 transition-all"
                                style={{ color: 'var(--color-error)' }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CommentItem;
