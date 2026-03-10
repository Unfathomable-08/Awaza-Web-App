import axios from 'axios';
import { Image as ImageIcon, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { createPost } from '../utils/post';

const MAX_CHARS = 380;
const IMGBB_API_KEY = '1a385d5be9971dda6af6d90952c6e372';

const ComposePost: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isOverLimit = text.length > MAX_CHARS;
    const isEmpty = text.trim().length === 0;
    const isDisabled = (isEmpty && !image) || isOverLimit || loading;

    const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handlePost = async () => {
        if (isDisabled) return;
        setLoading(true);
        try {
            let imageUrl = '';
            if (image && image.startsWith('data:image')) {
                const base64Data = image.split(',')[1];
                const formData = new FormData();
                formData.append('image', base64Data);
                const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
                imageUrl = res.data.data.url;
            }
            await createPost({ content: text.trim(), image: imageUrl, isPublic: true });
            navigate('/home');
        } catch (error: any) {
            alert(error.message || 'Failed to create post');
        } finally { setLoading(false); }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header
                    title="New Post"
                    rightElement={
                        <Button
                            title="Post"
                            onClick={handlePost}
                            loading={loading}
                            disabled={isDisabled}
                            className="h-8! rounded-full! px-4! w-auto! text-[13px]!"
                        />
                    }
                />

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <div className="flex flex-row gap-3 mb-5">
                        <Avatar uri={user?.avatar} size={42} />
                        <div className="flex flex-col justify-center">
                            <span className="font-bold text-[15px]" style={{ color: 'var(--color-text)' }}>{user?.name}</span>
                            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>Public</span>
                        </div>
                    </div>

                    <textarea
                        autoFocus
                        placeholder="What's on your mind?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full min-h-35 text-[17px] font-normal bg-transparent outline-none resize-none leading-relaxed"
                        style={{
                            color: isOverLimit ? 'var(--color-error)' : 'var(--color-text)',
                            caretColor: 'var(--color-primary)',
                        }}
                    />

                    {image && (
                        <div className="relative mt-4 rounded-2xl overflow-hidden shadow-soft group border" style={{ borderColor: 'var(--color-card-border)' }}>
                            <img src={image} alt="Preview" className="w-full aspect-video object-cover" />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all active:scale-90"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Toolbar */}
                <div
                    className="sticky bottom-0 border-t px-4 py-3 flex flex-row items-center justify-between"
                    style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-separator)' }}
                >
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 rounded-xl active:scale-95 transition-all"
                        style={{ color: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }}
                    >
                        <ImageIcon size={22} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImagePick} accept="image/*" className="hidden" />

                    <span
                        className="text-[12px] font-semibold"
                        style={{
                            color: isOverLimit ? 'var(--color-error)' : 'var(--color-text-muted)',
                            opacity: isOverLimit ? 1 : 0.5,
                        }}
                    >
                        {text.length} / {MAX_CHARS}
                    </span>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default ComposePost;