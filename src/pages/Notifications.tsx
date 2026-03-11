import React from 'react';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { Bell } from 'lucide-react';

const Notifications: React.FC = () => {
    return (
        <ScreenWrapper>
            <div className="flex flex-col min-h-full">
                <Header title="Notifications" showBackButton={true} />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
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
