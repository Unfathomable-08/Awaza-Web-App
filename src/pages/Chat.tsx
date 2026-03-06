import { onValue, push, ref, set } from 'firebase/database';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { rtdb } from '../lib/firebase';
import { timeAgo } from '../utils/common';
import { createChatsMetadata } from '../utils/inbox';
import { searchUserByID } from '../utils/search';

const Chat: React.FC = () => {
    const { username } = useParams<{ username: string }>(); // This is the chat room slug (e.g., id1_id2)
    const { user } = useAuth();
    const [otherUser, setOtherUser] = useState<any>({
        _id: "",
        username: "",
        name: "",
        avatar: "",
    });
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!username || !user) return;

        const fetchData = async () => {
            const parts = username.split("_");
            let otherIdentifier = parts.find(p => p !== user.id && p !== user.username) || parts[0];

            if (otherIdentifier) {
                try {
                    const results = await searchUserByID(otherIdentifier);
                    if (results) setOtherUser(results);
                } catch (err) {
                    console.error("Failed to fetch user data", err);
                }
            }
        };

        fetchData();
    }, [username, user]);

    useEffect(() => {
        if (!otherUser._id) return;
        createChatsMetadata([otherUser._id]);
    }, [otherUser._id]);

    useEffect(() => {
        if (!user || !rtdb || !username) return;

        const messagesRef = ref(rtdb, `chats/${username}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMessages = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                loadedMessages.sort((a, b) => a.createdAt - b.createdAt);
                setMessages(loadedMessages);
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [username, user]);

    useEffect(() => {
        // Auto scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !user || !rtdb || !username) return;

        const text = newMessage.trim();
        setNewMessage("");

        try {
            const messagesRef = ref(rtdb, `chats/${username}`);
            const newMsgRef = push(messagesRef);

            await set(newMsgRef, {
                text,
                userId: user.id,
                userEmail: user.email,
                createdAt: Date.now(),
            });
        } catch (e) {
            console.error("Send failed", e);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col h-screen overflow-hidden">
                <Header
                    centerElement={
                        <div className="flex flex-row items-center gap-3">
                            <Avatar uri={otherUser?.avatar} size={40} rounded={14} />
                            <div className="flex flex-col">
                                <span className="text-[16px] font-bold leading-none" style={{ color: colors.text }}>
                                    {otherUser?.name || otherUser?.username || "Chat"}
                                </span>
                                <span className="text-[12px] font-bold text-green-500">Online</span>
                            </div>
                        </div>
                    }
                />

                {/* Messages List */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 scroll-smooth"
                >
                    {messages.map((item) => {
                        const isMine = item.userId === user?.id || item.userEmail === user?.email;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={item.id}
                                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[85%] ${isMine ? 'ml-auto' : 'mr-auto'}`}
                            >
                                <div
                                    className={`px-4 py-3 rounded-2xl text-[16px] font-medium leading-relaxed shadow-sm ${isMine
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                    style={{ backgroundColor: isMine ? colors.primary : undefined }}
                                >
                                    {item.text}
                                </div>
                                <span className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-tighter px-1">
                                    {timeAgo(item.createdAt)}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 pb-10">
                    <div className="flex flex-row items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                        <textarea
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Message..."
                            className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-[16px] font-medium resize-none max-h-32 placeholder:opacity-30"
                            style={{ color: colors.text }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white active:scale-95 transition-all shadow-md disabled:opacity-30 disabled:shadow-none transition-all group"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <Send size={20} className="group-active:translate-x-1 group-active:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Chat;
