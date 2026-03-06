import { motion } from 'framer-motion';
import React from 'react';
import { colors } from '../constants/Colors';
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
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-row px-5 py-4 gap-3 border-b border-gray-50 last:border-b-0"
        >
            <Avatar uri={item?.user?.image || item?.user?.avatar} size={36} rounded={12} />
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <span className="font-bold text-[14px]" style={{ color: colors.text }}>
                            {item?.user?.name}
                        </span>
                        <span className="text-[12px] opacity-50" style={{ color: colors.textMuted }}>
                            • {createdAt}
                        </span>
                    </div>
                </div>
                <p className="text-[14px] leading-relaxed" style={{ color: colors.text }}>
                    {item?.content}
                </p>

                <div className="flex flex-row gap-5 mt-1">
                    {onReply && (
                        <button
                            onClick={() => onReply(item)}
                            className="text-[12px] font-bold hover:opacity-70 active:scale-95 transition-all"
                            style={{ color: colors.textLight }}
                        >
                            Reply
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => onDelete && onDelete(item?._id || item?.id)}
                            className="text-[12px] font-bold hover:opacity-70 active:scale-95 transition-all"
                            style={{ color: colors.error }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CommentItem;
