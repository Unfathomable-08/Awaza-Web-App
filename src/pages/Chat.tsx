import { onValue, push, ref, set } from 'firebase/database';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { rtdb } from '../lib/firebase';
import { timeAgo } from '../utils/common';
import { createChatsMetadata } from '../utils/inbox';
import { searchUserByID } from '../utils/search';

const Chat: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { user } = useAuth();
    const [otherUser, setOtherUser] = useState<any>({ _id: '', username: '', name: '', avatar: '' });
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!username || !user) return;
        const fetchData = async () => {
            const parts = username.split('_');
            let otherId = parts.find(p => p !== user.id && p !== user.username) || parts[0];
            if (otherId) {
                try { const results = await searchUserByID(otherId); if (results) setOtherUser(results); }
                catch (err) { console.error(err); }
            }
        };
        fetchData();
    }, [username, user]);

    useEffect(() => { if (otherUser._id) createChatsMetadata([otherUser._id]); }, [otherUser._id]);

    useEffect(() => {
        if (!user || !rtdb || !username) return;
        const messagesRef = ref(rtdb, `chats/${username}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loaded = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                loaded.sort((a, b) => a.createdAt - b.createdAt);
                setMessages(loaded);
            } else { setMessages([]); }
        });
        return () => unsubscribe();
    }, [username, user]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !user || !rtdb || !username) return;
        const text = newMessage.trim(); setNewMessage('');
        try {
            const messagesRef = ref(rtdb, `chats/${username}`);
            const newMsgRef = push(messagesRef);
            await set(newMsgRef, { text, userId: user.id, userEmail: user.email, createdAt: Date.now() });
        } catch (e) { console.error(e); }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col h-svh overflow-hidden">
                <Header
                    centerElement={
                        <div className="flex flex-row items-center gap-2.5">
                            <Avatar uri={otherUser?.avatar} size={36} />
                            <div className="flex flex-col">
                                <span className="text-[15px] font-bold leading-none" style={{ color: 'var(--color-text)' }}>
                                    {otherUser?.name || otherUser?.username || 'Chat'}
                                </span>
                                <span className="text-[11px] font-semibold text-green-500">Online</span>
                            </div>
                        </div>
                    }
                />

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
                >
                    {messages.map((item) => {
                        const isMine = item.userId === user?.id || item.userEmail === user?.email;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={item.id}
                                className={`flex flex-col max-w-[78%] ${isMine ? 'items-end ml-auto' : 'items-start mr-auto'}`}
                            >
                                <div
                                    className="px-3.5 py-2.5 text-[15px] font-normal leading-relaxed shadow-sm"
                                    style={{
                                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        backgroundColor: isMine ? 'var(--color-primary)' : 'var(--color-input-bg)',
                                        color: isMine ? 'white' : 'var(--color-text)',
                                    }}
                                >
                                    {item.text}
                                </div>
                                <span className="text-[10px] font-semibold mt-1 px-1" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>
                                    {timeAgo(item.createdAt)}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Input */}
                <div
                    className="px-3 py-3 border-t"
                    style={{
                        backgroundColor: 'var(--color-bg)',
                        borderColor: 'var(--color-separator)',
                        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
                    }}
                >
                    <div
                        className="flex flex-row items-end gap-2 rounded-2xl px-3 py-2 border"
                        style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-border)' }}
                    >
                        <textarea
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            placeholder="Message..."
                            className="flex-1 bg-transparent border-none outline-none px-1 py-1 text-[15px] font-normal resize-none max-h-28 leading-relaxed"
                            style={{ color: 'var(--color-text)', caretColor: 'var(--color-primary)' }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-white active:scale-90 transition-all disabled:opacity-30 shrink-0 mb-0.5"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <Send size={17} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Chat;