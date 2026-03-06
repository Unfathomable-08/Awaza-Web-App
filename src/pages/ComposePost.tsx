import axios from 'axios';
import { Image as ImageIcon, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { createPost } from '../utils/post';

const MAX_CHARS = 380;
const IMGBB_API_KEY = "1a385d5be9971dda6af6d90952c6e372";

const ComposePost: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [text, setText] = useState("");
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
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => setImage(null);

    const handlePost = async () => {
        if (isDisabled) return;
        setLoading(true);

        try {
            let imageUrl = "";

            if (image && image.startsWith('data:image')) {
                const base64Data = image.split(',')[1];
                const formData = new FormData();
                formData.append("image", base64Data);

                const res = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                    formData
                );
                imageUrl = res.data.data.url;
            }

            await createPost({
                content: text.trim(),
                image: imageUrl,
                isPublic: true,
            });

            navigate('/home');
        } catch (error: any) {
            console.error("Post Error:", error);
            alert(error.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-full">
                <Header
                    title="New Post"
                    rightElement={
                        <Button
                            title="Post"
                            onClick={handlePost}
                            loading={loading}
                            disabled={isDisabled}
                            className="!h-9 !rounded-full !px-5 !w-auto"
                            textClassName="!text-[14px]"
                            hasShadow={false}
                        />
                    }
                />

                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="flex flex-row gap-4 mb-8">
                        <Avatar uri={user?.avatar} size={50} rounded={18} />
                        <div className="flex flex-col justify-center">
                            <span className="font-bold text-[17px]" style={{ color: colors.text }}>{user?.name}</span>
                            <span className="text-xs font-bold opacity-40 uppercase tracking-wider">Public Post</span>
                        </div>
                    </div>

                    <textarea
                        autoFocus
                        placeholder="What's on your mind?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full min-h-[160px] text-xl font-medium bg-transparent outline-none resize-none placeholder:opacity-30"
                        style={{ color: colors.text }}
                    />

                    {image && (
                        <div className="relative mt-6 rounded-3xl overflow-hidden shadow-xl group">
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full aspect-video object-cover"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Toolbar */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 rounded-2xl bg-gray-50 text-primary active:scale-95 transition-all text-blue-500"
                            style={{ color: colors.primary }}
                        >
                            <ImageIcon size={26} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImagePick}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="flex flex-row items-center gap-1">
                        <span
                            className={`text-sm font-bold ${text.length > MAX_CHARS ? 'text-rose-500' : 'opacity-40'}`}
                        >
                            {text.length}
                        </span>
                        <span className="text-sm font-black opacity-20">/</span>
                        <span className="text-sm font-bold opacity-20">{MAX_CHARS}</span>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default ComposePost;
