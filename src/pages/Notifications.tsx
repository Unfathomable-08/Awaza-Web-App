import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { Bell } from 'lucide-react';
import { requestNotificationPermission } from '../lib/firebase';
import { saveFCMToken, removeFCMToken } from '../utils/notifications';
import { notify } from '../lib/toast';

const Notifications: React.FC = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedOptIn = localStorage.getItem('notificationsEnabled');
        if (storedOptIn === 'true') {
            setIsEnabled(true);
        }
    }, []);

    const handleToggle = async () => {
        const newValue = !isEnabled;
        setIsLoading(true);

        try {
            if (newValue) {
                // User wants to enable notifications
                const token = await requestNotificationPermission();
                if (token) {
                    await saveFCMToken(token);
                    localStorage.setItem('notificationsEnabled', 'true');
                    localStorage.setItem('fcmToken', token); // Store locally for removal later
                    setIsEnabled(true);
                    notify.success('Push notifications enabled');
                } else {
                    notify.error('Please allow notifications in browser settings');
                }
            } else {
                // User wants to disable notifications
                const token = localStorage.getItem('fcmToken');
                if (token) {
                    await removeFCMToken(token);
                }
                localStorage.removeItem('notificationsEnabled');
                localStorage.removeItem('fcmToken');
                setIsEnabled(false);
                notify.success('Push notifications disabled');
            }
        } catch (error) {
            console.error(error);
            notify.error('Failed to update settings');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header title="Notifications" showBackButton={true} />
                
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-[15px]">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Get alerts for new messages</p>
                    </div>
                    <button
                        onClick={handleToggle}
                        disabled={isLoading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-primary' : 'bg-gray-300'} ${isLoading ? 'opacity-50' : ''}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-24">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                        <Bell size={40} className="text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No notifications yet</h2>
                    <p className="text-gray-500 max-w-xs">
                        When you get mentions or likes, you'll find them here.
                    </p>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Notifications;
