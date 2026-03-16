import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { Bell, Loader2 } from 'lucide-react';
import { requestNotificationPermission } from '../lib/firebase';
import { saveFCMToken, removeFCMToken } from '../utils/notifications';
import { getNotifications, markNotificationsAsRead } from '../utils/otherNotifications';
import { notify } from '../lib/toast';
import type { Notification } from '../types';
import NotificationItem from '../components/NotificationItem';

const Notifications: React.FC = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoadingToggle, setIsLoadingToggle] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedOptIn = localStorage.getItem('notificationsEnabled');
        if (storedOptIn === 'true') {
            setIsEnabled(true);
        }
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data.notifications || []);
            
            // Mark all as read in backend, but don't refresh UI state for better UX
            if (data.notifications && data.notifications.length > 0) {
                const unreadNotifications = data.notifications.filter((n: Notification) => !n.read);
                if (unreadNotifications.length > 0) {
                    // Start ID and End ID are based on the fetched list to mark the range
                    const startId = data.notifications[data.notifications.length - 1]._id;
                    const endId = data.notifications[0]._id;
                    await markNotificationsAsRead(startId, endId);
                }
            }
        } catch (error) {
            console.error(error);
            notify.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        const newValue = !isEnabled;
        setIsLoadingToggle(true);

        try {
            if (newValue) {
                const token = await requestNotificationPermission();
                if (token) {
                    await saveFCMToken(token);
                    localStorage.setItem('notificationsEnabled', 'true');
                    localStorage.setItem('fcmToken', token);
                    setIsEnabled(true);
                    notify.success('Push notifications enabled');
                } else {
                    notify.error('Please allow notifications in browser settings');
                }
            } else {
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
            setIsLoadingToggle(false);
        }
    };

    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header title="Notifications" showBackButton={true} />
                
                <div className="px-4 pb-4 pt-2 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h3 className="font-semibold text-[15px]">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Get alerts for new activity</p>
                    </div>
                    <button
                        onClick={handleToggle}
                        disabled={isLoadingToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-primary' : 'bg-gray-300'} ${isLoadingToggle ? 'opacity-50' : ''}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="flex-1 bg-white">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="flex flex-col">
                            {notifications.map((notif) => (
                                <NotificationItem key={notif._id} notification={notif} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center pt-24">
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                <Bell size={40} className="text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">No notifications yet</h2>
                            <p className="text-gray-500 max-w-xs">
                                When you get mentions or likes, you'll find them here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ScreenWrapper>
    );
};

export default Notifications;
