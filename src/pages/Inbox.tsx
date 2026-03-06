import { MessageSquare, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { getChatsMetadata } from '../utils/inbox';
import { searchUsers } from '../utils/search';

const Inbox: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getChatsMetadata();
            setMessages(res || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setIsSearching(true);
        try {
            const results = await searchUsers(searchQuery.trim());
            setSearchResults(results || []);
        } catch (err) {
            console.error("Search error", err);
            alert("Failed to search users.");
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
        setSearchResults([]);
    };

    const handleChatPress = (chat: any) => {
        navigate(`/chat/${chat.slug}`);
    };

    const handleUserPress = (targetUser: any) => {
        if (!user || !targetUser) return;
        const sortedUsernames = [user.id, targetUser._id].sort();
        const chatPath = sortedUsernames.join("_");
        navigate(`/chat/${chatPath}`);
    };

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-full">
                <Header title="Messages" />

                <div className="px-6 py-4 flex flex-col gap-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full h-12 pl-12 pr-12 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            style={{ color: colors.text }}
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Content List */}
                    <div className="flex flex-col">
                        {loading && !isSearching && !messages.length ? (
                            <div className="flex justify-center py-10">
                                <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {(isSearching ? searchResults : messages).length > 0 ? (
                                    (isSearching ? searchResults : messages).map((item: any) => {
                                        if (isSearching) {
                                            // Search Result Item
                                            return (
                                                <button
                                                    key={item._id}
                                                    onClick={() => handleUserPress(item)}
                                                    className="flex flex-row items-center gap-4 py-4 active:bg-gray-50 transition-all rounded-2xl px-2 group"
                                                >
                                                    <Avatar uri={item.avatar} size={50} rounded={18} />
                                                    <div className="flex flex-col items-start">
                                                        <span className="font-bold text-[17px]" style={{ color: colors.text }}>{item.username}</span>
                                                        <span className="text-xs font-bold opacity-30">@{item.username}</span>
                                                    </div>
                                                </button>
                                            );
                                        } else {
                                            // Message Item
                                            const otherUser = item.users?.find((u: any) => u._id !== user?.id) || item.users?.[0];
                                            return (
                                                <button
                                                    key={item._id}
                                                    onClick={() => handleChatPress(item)}
                                                    className="flex flex-row items-center gap-4 py-4 active:bg-gray-50 transition-all rounded-2xl px-2 group"
                                                >
                                                    <div className="relative">
                                                        <Avatar uri={otherUser?.avatar} size={56} rounded={20} />
                                                        {otherUser?.isOnline && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-3 border-white shadow-sm" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col items-start gap-1 overflow-hidden">
                                                        <div className="w-full flex flex-row items-center justify-between">
                                                            <span className="font-bold text-[17px] truncate" style={{ color: colors.text }}>
                                                                {otherUser?.username || 'Unknown'}
                                                            </span>
                                                            <span className="text-xs font-bold opacity-30 uppercase tracking-tighter">
                                                                {item.timestamp}
                                                            </span>
                                                        </div>
                                                        <div className="w-full flex flex-row items-center justify-between">
                                                            <p className="text-[15px] font-medium opacity-50 truncate" style={{ color: colors.textLight }}>
                                                                {item.lastMessage}
                                                            </p>
                                                            {item.unread > 0 && (
                                                                <div className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.primary }}>
                                                                    <span className="text-[10px] font-black text-white">{item.unread}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                        <div className="w-20 h-20 rounded-[30px] bg-gray-50 flex items-center justify-center mb-6 text-gray-200">
                                            <MessageSquare size={40} />
                                        </div>
                                        <h3 className="text-xl font-black mb-2" style={{ color: colors.text }}>
                                            {isSearching ? "No users found" : "No messages yet"}
                                        </h3>
                                        <p className="text-sm font-medium opacity-40 leading-relaxed">
                                            {isSearching
                                                ? `We couldn't find any results for "${searchQuery}"`
                                                : "Start a conversation with your friends and share your favorite moments!"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Inbox;
