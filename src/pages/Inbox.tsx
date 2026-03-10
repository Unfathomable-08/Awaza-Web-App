/**
 * @file Inbox.tsx
 * @description Lists active chats and allows searching for new users to message.
 *
 * Features:
 *  - Search bar to find users by username
 *  - Displays conversation list with unread counts and last message
 *  - Online status indicators for active users
 */

import { MessageSquare, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { getChatsMetadata } from '../utils/inbox';
import { searchUsers } from '../utils/search';

/**
 * Inbox
 *
 * Displays all active messages. Supports searching to initiate new chats.
 */
const Inbox: React.FC = () => {
    // ── Routing & Auth ───────────────────────────────────────────────────
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // ── Form State ───────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    
    // ── Data State ───────────────────────────────────────────────────────
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => { fetchData(); }, []);

    /** Fetch user's existing chat history */
    const fetchData = async () => {
        setLoading(true);
        try { const res = await getChatsMetadata(); setMessages(res || []); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    /** Query users by username */
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true); setIsSearching(true);
        try { const results = await searchUsers(searchQuery.trim()); setSearchResults(results || []); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    /** Clear current search query and reset view */
    const clearSearch = () => { setSearchQuery(''); setIsSearching(false); setSearchResults([]); };

    /** Navigate to an existing chat screen */
    const handleChatPress = (chat: any) => navigate(`/chat/${chat.slug}`);
    
    /** Initialise or navigate to a new chat with a searched user */
    const handleUserPress = (targetUser: any) => {
        if (!user || !targetUser) return;
        const chatPath = [user.id, targetUser._id].sort().join('_');
        navigate(`/chat/${chatPath}`);
    };

    const listData = isSearching ? searchResults : messages;

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header title="Messages" showBackButton={true} />

                <div className="px-4 py-3 flex flex-col gap-4">
                    {/* ── Search Bar ── */}
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                            <Search size={17} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full h-11 pl-10 pr-10 rounded-xl outline-none font-medium text-[14px] transition-all"
                            style={{
                                backgroundColor: 'var(--color-input-bg)',
                                color: 'var(--color-text)',
                                caretColor: 'var(--color-primary)',
                            }}
                        />
                        {searchQuery && (
                            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* ── Chat / Search Results List ── */}
                    <div className="flex flex-col">
                        {loading && !listData.length ? (
                            <div className="flex justify-center py-10">
                                <div className="spinner" style={{ width: '28px', height: '28px', borderWidth: '2px' }} />
                            </div>
                        ) : listData.length > 0 ? (
                            <div className="flex flex-col">
                                {listData.map((item: any) => {
                                    if (isSearching) {
                                        return (
                                            <button
                                                key={item._id}
                                                onClick={() => handleUserPress(item)}
                                                className="flex flex-row items-center gap-3 py-3 px-1 active:bg-gray-50/80 transition-all rounded-xl"
                                            >
                                                <Avatar uri={item.avatar} size={46} />
                                                <div className="flex flex-col items-start">
                                                    <span className="font-bold text-[15px]" style={{ color: 'var(--color-text)' }}>{item.username}</span>
                                                    <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>@{item.username}</span>
                                                </div>
                                            </button>
                                        );
                                    } else {
                                        const otherUser = item.users?.find((u: any) => u._id !== user?.id) || item.users?.[0];
                                        return (
                                            <button
                                                key={item._id}
                                                onClick={() => handleChatPress(item)}
                                                className="flex flex-row items-center gap-3 py-3 px-1 active:bg-gray-50/80 transition-all rounded-xl"
                                            >
                                                <div className="relative">
                                                    <Avatar uri={otherUser?.avatar} size={50} />
                                                    {otherUser?.isOnline && (
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col items-start gap-0.5 overflow-hidden">
                                                    <div className="w-full flex flex-row items-center justify-between">
                                                        <span className="font-bold text-[15px] truncate" style={{ color: 'var(--color-text)' }}>
                                                            {otherUser?.username || 'Unknown'}
                                                        </span>
                                                        <span className="text-[11px] font-semibold ml-2 shrink-0" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>
                                                            {item.timestamp}
                                                        </span>
                                                    </div>
                                                    <div className="w-full flex flex-row items-center justify-between">
                                                        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-muted)' }}>
                                                            {item.lastMessage}
                                                        </p>
                                                        {item.unread > 0 && (
                                                            <div className="min-w-4.5 h-4.5 px-1.5 rounded-full flex items-center justify-center ml-2 shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                                                                <span className="text-[10px] font-black text-white">{item.unread}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    }
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-separator)' }}>
                                    <MessageSquare size={32} style={{ color: 'var(--color-text-muted)', opacity: 1 }} />
                                </div>
                                <h3 className="text-[16px] font-black mb-1.5" style={{ color: 'var(--color-text)' }}>
                                    {isSearching ? 'No users found' : 'No messages yet'}
                                </h3>
                                <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                    {isSearching ? `No results for "${searchQuery}"` : 'Start a conversation with your friends!'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Inbox;