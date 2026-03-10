/**
 * @file UpdateProfile.tsx
 * @description Allows the user to change their display name and avatar.
 *
 * Image flow:
 *  1. User picks a file from their device
 *  2. Image is previewed locally via a FileReader Data URL
 *  3. On save, the image is uploaded to ImgBB and the returned URL stored
 */

import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultUser from '../assets/images/default_user.jpg';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { useAuth } from '../contexts/authContext';
import { updateProfile } from '../utils/accountSetting';

/** ImgBB public API key used for avatar uploads */
const IMGBB_API_KEY = '1a385d5be9971dda6af6d90952c6e372';

/**
 * UpdateProfile
 *
 * The avatar picker is driven by a hidden `<input type="file">` and a
 * visible camera button overlay so the design stays clean.
 */
const UpdateProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();

    // ── Local state ──────────────────────────────────────────────────────
    const [name,    setName]    = useState(user?.name || '');
    const [image,   setImage]   = useState<string | null>(user?.avatar || null);
    const [loading, setLoading] = useState(false);

    /** Hidden file input ref — triggered by the camera button */
    const fileInputRef = useRef<HTMLInputElement>(null);

    /** Read the selected file into a Data URL for instant preview */
    const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    /** Upload the image to ImgBB (if changed) then save the profile */
    const handleSave = async () => {
        if (!name.trim()) { alert('Name cannot be empty'); return; }

        setLoading(true);
        try {
            let imageUrl = user?.avatar || '';

            // Only upload if there's a new image (Data URL vs existing URL)
            if (image?.startsWith('data:image')) {
                const base64Data = image.split(',')[1];
                const formData = new FormData();
                formData.append('image', base64Data);
                const res = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                    formData,
                );
                imageUrl = res.data.data.url;
            }

            await updateProfile(name.trim(), imageUrl);

            // Patch the auth context so the rest of the app reflects the change
            if (login && user) login({ ...user, name: name.trim(), avatar: imageUrl });

            alert('Profile updated successfully!');
            navigate(-1);
        } catch (error: any) {
            alert(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full pb-10">
                <Header title="Edit Profile" showBackButton />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-5 pt-8"
                >
                    {/* ── Avatar picker ── */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            {/* Current / preview avatar */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 shadow-soft border-app">
                                <img
                                    src={image || defaultUser}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Camera button overlay */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                aria-label="Change profile photo"
                                className="
                                    absolute -bottom-1 -right-1 z-10
                                    p-2.5 rounded-full shadow-md
                                    text-white bg-primary
                                    transition-all active:scale-95
                                "
                            >
                                <Camera size={16} strokeWidth={2.5} />
                            </button>

                            {/* Hidden native file picker */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImagePick}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <p className="mt-3 text-[12px] font-semibold uppercase tracking-widest text-muted opacity-50">
                            Change Photo
                        </p>
                    </div>

                    {/* ── Name field ── */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold ml-1 uppercase tracking-wide text-muted">
                                Full Name
                            </label>
                            <Input placeholder="Enter your name" value={name} onChange={setName} />
                        </div>

                        <Button title="Save Changes" onClick={handleSave} loading={loading} hasShadow />
                    </div>
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default UpdateProfile;
