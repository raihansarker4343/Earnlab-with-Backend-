import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import type { User } from '../types';
import { API_URL } from '../constants';

// Helper function to ensure numeric fields from the API/localStorage are numbers
const sanitizeUser = (rawUser: User): User => {
    const user = { ...rawUser };
    const numericKeys: (keyof User)[] = [
        'xp', 'xpToNextLevel', 'totalEarned', 'balance', 'last30DaysEarned',
        'completedTasks', 'totalWagered', 'totalProfit', 'totalWithdrawn',
        'totalReferrals', 'referralEarnings'
    ];

    for (const key of numericKeys) {
        if (user[key] !== undefined && user[key] !== null) {
            // @ts-ignore - TS has trouble with dynamic keys on interfaces
            user[key] = Number(user[key]);
        }
    }
    return user;
};

const ProfileEditModal: React.FC = () => {
    const { user, setUser, isProfileEditModalOpen, setIsProfileEditModalOpen } = useContext(AppContext);
    
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (user && isProfileEditModalOpen) {
            setUsername(user.username);
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user, isProfileEditModalOpen]);

    const closeModal = () => {
        setIsProfileEditModalOpen(false);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication error. Please log in again.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, avatarUrl })
            });
            const data: User = await response.json();
            if (!response.ok) {
                // @ts-ignore
                throw new Error(data.message || 'Failed to update profile.');
            }
            
            const sanitizedData = sanitizeUser(data);
            setUser(sanitizedData); 
            localStorage.setItem('user', JSON.stringify(sanitizedData));
            closeModal();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isProfileEditModalOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out bg-[#0F172A]/80 backdrop-blur-sm"
            onClick={closeModal}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-[#141c2f] text-slate-800 dark:text-slate-200 p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full m-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
                    <button 
                        onClick={closeModal} 
                        className="absolute -top-4 -right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Username</label>
                        <input 
                            type="text" 
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-slate-100 dark:bg-[#1e293b] p-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Avatar URL</label>
                        <input 
                            type="url" 
                            id="avatarUrl"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/image.png"
                            className="w-full bg-slate-100 dark:bg-[#1e293b] p-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                        <button 
                            type="button"
                            onClick={closeModal}
                            className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-500 disabled:cursor-wait"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;