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
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const IMGBB_API_KEY = '1a385d5be9971dda6af6d90952c6e372';
        if (!name.trim()) { alert('Name cannot be empty'); return; }
        setLoading(true);
        try {
            let imageUrl = user?.avatar || '';
            if (image && image.startsWith('data:image')) {
                const base64Data = image.split(',')[1];
                const formData = new FormData();
                formData.append('image', base64Data);
                const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
                imageUrl = res.data.data.url;
            }
            await updateProfile(name.trim(), imageUrl);
            if (login && user) login({ ...user, name: name.trim(), avatar: imageUrl });
            alert('Profile updated successfully!');
            navigate(-1);
        } catch (error: any) { alert(error.message || 'Failed to update profile'); }
        finally { setLoading(false); }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full pb-10">
                <Header title="Edit Profile" showBackButton={true} />

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-5 pt-8"
                >
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 shadow-soft" style={{ borderColor: 'var(--color-border)' }}>
                                <img src={image || defaultUser} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 p-2.5 rounded-full shadow-md text-white transition-all active:scale-95 z-10"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                <Camera size={16} strokeWidth={2.5} />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImagePick} accept="image/*" className="hidden" />
                        </div>
                        <p className="mt-3 text-[12px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
                            Change Photo
                        </p>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold ml-1 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                                Full Name
                            </label>
                            <Input placeholder="Enter your name" value={name} onChange={setName} />
                        </div>
                        <Button title="Save Changes" onClick={handleSave} loading={loading} hasShadow={true} />
                    </div>
                </motion.div>
            </div>
        </ScreenWrapper>
    );
};

export default UpdateProfile;
