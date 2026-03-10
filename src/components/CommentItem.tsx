/**
 * @file CommentItem.tsx
 * @description A single top-level comment row.
 *
 * Displays the author's avatar, name, timestamp, comment body and optional
 * action links (Reply / Delete).  Used inside PostDetails for the flat
 * comment list and can also be composed into NestedComment threads.
 */

import { motion } from 'framer-motion';
import React from 'react';
import { timeAgo } from '../utils/common';
import Avatar from './Avatar';

/** Props for the CommentItem component */
interface CommentProps {
    /** Comment object from the API */
    item: any;
    /** Called when the user taps "Reply" — receives the comment object */
    onReply?: (item: any) => void;
    /** When true the "Delete" action link is shown */
    canDelete?: boolean;
    /** Called when the user taps "Delete" — receives the comment id */
    onDelete?: (id: string) => void;
}

/**
 * CommentItem
 *
 * Slides in from the left on mount.  The "Reply" and "Delete" links are only
 * rendered when the corresponding prop/flag is provided.
 */
const CommentItem: React.FC<CommentProps> = ({
    item,
    onReply,
    canDelete,
    onDelete,
}) => {
    const createdAt = timeAgo(item?.createdAt || new Date().toISOString());

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-row px-4 py-3 gap-3 border-b last:border-b-0 border-sep"
        >
            {/* Author avatar */}
            <Avatar uri={item?.user?.image || item?.user?.avatar} size={34} />

            <div className="flex-1 flex flex-col gap-1">
                {/* Author name + timestamp */}
                <div className="flex flex-row items-center gap-1.5">
                    <span className="font-bold text-[14px] text-app">
                        {item?.user?.name}
                    </span>
                    <span className="text-[12px] text-muted">
                        · {createdAt}
                    </span>
                </div>

                {/* Comment body */}
                <p className="text-[14px] leading-relaxed text-light">
                    {item?.content}
                </p>

                {/* Action links */}
                {(onReply || canDelete) && (
                    <div className="flex flex-row gap-4 mt-1">
                        {onReply && (
                            <button
                                onClick={() => onReply(item)}
                                className="
                                    text-[12px] font-bold text-muted
                                    hover:opacity-70 active:scale-95 transition-all
                                "
                            >
                                Reply
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => onDelete?.(item?._id || item?.id)}
                                className="
                                    text-[12px] font-bold text-error
                                    hover:opacity-70 active:scale-95 transition-all
                                "
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
