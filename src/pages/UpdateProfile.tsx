import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultUser from '../assets/images/default_user.jpg';
import Button from '../components/Button';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/Colors';
import { useAuth } from '../contexts/authContext';
import { updateProfile } from '../utils/accountSetting';

const UpdateProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [image, setImage] = useState<string | null>(user?.avatar || null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleSave = async () => {
        const IMGBB_API_KEY = "1a385d5be9971dda6af6d90952c6e372";

        if (!name.trim()) {
            alert("Name cannot be empty");
            return;
        }

        setLoading(true);
        try {
            let imageUrl = user?.avatar || "";

            // If a new image was picked (it starts with data:image)
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

            const updatedData = await updateProfile(name.trim(), imageUrl);

            // Update auth context state if available
            if (login && user) {
                login({ ...user, name: name.trim(), avatar: imageUrl });
            }

            alert("Profile updated successfully!");
            navigate(-1);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="white">
            <div className="flex flex-col min-h-full pb-10">
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex flex-row items-center justify-between h-14 px-4 w-full border-b border-gray-100">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-black/5 active:bg-black/10 rounded-full transition-all"
                    >
                        <X size={24} color={colors.text} />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight" style={{ color: colors.text }}>Edit Profile</h1>
                    <div className="w-10"></div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-6 pt-10"
                >
                    {/* Avatar Selection */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                                <img
                                    src={image || defaultUser}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 p-3 rounded-2xl shadow-lg text-white transition-all transform hover:scale-105 active:scale-95 z-10"
                                style={{ backgroundColor: colors.primary }}
                            >
                                <Camera size={20} strokeWidth={2.5} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImagePick}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <p className="mt-4 text-sm font-bold opacity-40 uppercase tracking-widest">Change Avatar</p>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold ml-1 opacity-60" style={{ color: colors.textLight }}>Full Name</label>
                            <Input
                                placeholder="Enter your name"
                                value={name}
                                onChange={setName}
                            />
                        </div>

                        <Button
                            title="Update Profile"
                            onClick={handleSave}
                            loading={loading}
                            className="mt-4"
                        />
                    </div>
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default UpdateProfile;
