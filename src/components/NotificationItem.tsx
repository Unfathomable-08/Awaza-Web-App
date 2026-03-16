import React from 'react';
import { Heart, MessageSquare, UserPlus } from 'lucide-react';
import Avatar from './Avatar';
import { timeAgo } from '../utils/common';
import type { Notification, User } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const navigate = useNavigate();

    // Extract actor info (the person who triggered the notification)
    const actor = (
        notification.likedBy ||
        notification.commentedBy ||
        notification.followedBy
    ) as User | undefined;

    const getIcon = () => {
        switch (notification.type) {
            case 'like':
                return <Heart size={16} className="fill-red-500 text-red-500" />;
            case 'comment':
                return <MessageSquare size={16} className="fill-blue-500 text-blue-500" />;
            case 'follow':
                return <UserPlus size={16} className="text-primary" />;
            default:
                return null;
        }
    };

    const getContent = () => {
        const actorName = actor?.name || actor?.username || 'Someone';

        switch (notification.type) {
            case 'like':
                return (
                    <p className="text-[14px] text-gray-800">
                        <span className="font-bold">{actorName}</span> liked your post
                    </p>
                );
            case 'comment':
                return (
                    <div className="flex flex-col">
                        <p className="text-[14px] text-gray-800">
                            <span className="font-bold">{actorName}</span> commented: {notification.content}
                        </p>
                    </div>
                );
            case 'follow':
                return (
                    <p className="text-[14px] text-gray-800">
                        <span className="font-bold">{actorName}</span> started following you
                    </p>
                );
            default:
                return <p className="text-[14px] text-gray-800">New notification</p>;
        }
    };

    const handlePress = () => {
        if (notification.postId) {
            navigate(`/post/${notification.postId}`);
        } else if (actor?.username) {
            navigate(`/profile/${actor.username}`);
        }
    };

    return (
        <div
            onClick={handlePress}
            className={`
                flex items-start p-4 border-b border-gray-50 
                active:bg-gray-50 transition-colors cursor-pointer
                ${!notification.read ? 'bg-blue-50/30' : ''}
            `}
        >
            <div className="relative mr-3">
                <Avatar uri={actor?.avatar} size={40} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    {getIcon()}
                </div>
            </div>
            <div className="flex-1 flex flex-col pt-0.5">
                {getContent()}
                <span className="text-[12px] text-gray-400 mt-1">
                    {timeAgo(notification.createdAt)}
                </span>
            </div>
        </div>
    );
};

export default NotificationItem;
