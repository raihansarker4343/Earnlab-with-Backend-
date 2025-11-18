import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { BellIcon, ChevronDownIcon, WalletIcon, LogoutIcon, MenuIcon } from './icons/HeaderIcons';
import { MoonIcon, SunIcon } from './icons/FooterIcons';
import { API_URL } from '../constants';

interface HeaderProps {
    onLogout: () => void;
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }
    return `${Math.max(0, Math.floor(seconds))} sec ago`;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const { user, balance, setIsWalletModalOpen, isSidebarCollapsed, setIsSidebarCollapsed, setCurrentPage, setIsMobileSidebarOpen, theme, setTheme, notifications, setNotifications } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // FIX: The `toggleTheme` function was missing. It is now defined to update the theme context.
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOpenNotifications = async () => {
        const nextState = !isNotificationsOpen;
        setIsNotificationsOpen(nextState);

        if (nextState && unreadCount > 0) {
            const currentNotifications = [...notifications];
            const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
            setNotifications(updatedNotifications);

            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/notifications/read`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to mark notifications as read');
            } catch (error) {
                console.error("Failed to mark notifications as read", error);
                setNotifications(currentNotifications); // Revert on failure
            }
        }
    };

    if (!user) return null;

  return (
    <header className="bg-white dark:bg-[#141c2f] p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden transition-transform active:scale-95"
                aria-label="Open menu"
            >
                <MenuIcon />
            </button>
            {isSidebarCollapsed && (
                <button 
                    onClick={() => setIsSidebarCollapsed(false)} 
                    className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hidden lg:block transition-transform active:scale-95"
                    aria-label="Open sidebar"
                >
                    <MenuIcon />
                </button>
            )}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white hidden lg:block">EarnLab</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-green-500 dark:text-green-400 font-bold">
                <span>${balance.toFixed(2)}</span>
            </div>
            <button onClick={() => setIsWalletModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg flex items-center gap-2 text-sm sm:text-base transition-transform active:scale-95">
                <WalletIcon />
                <span className="hidden sm:inline">Wallet</span>
            </button>
            <button 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-transform active:scale-95"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            <div className="relative" ref={notificationsRef}>
                <button 
                    onClick={handleOpenNotifications}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 transition-transform active:scale-95 relative"
                    aria-label="Notifications"
                >
                    <BellIcon />
                    {unreadCount > 0 && (
                         <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#141c2f]">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                         </span>
                    )}
                </button>
                {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-20 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                        </div>
                        <div className="overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        onClick={() => {
                                            if (notification.linkTo) {
                                                setCurrentPage('Profile');
                                            }
                                            setIsNotificationsOpen(false);
                                        }}
                                        className={`p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer`}
                                    >
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{notification.message}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo(notification.createdAt)}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                    <i className="fas fa-bell-slash text-3xl mb-3"></i>
                                    <p>You have no new notifications.</p>
                                </div>
                            )}
                        </div>
                         <div className="p-2 border-t border-slate-200 dark:border-slate-700 text-center">
                            <button onClick={() => setIsNotificationsOpen(false)} className="text-sm text-blue-500 hover:underline">Close</button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 transition-transform active:scale-95">
                    <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full" />
                    <span className="font-semibold text-slate-900 dark:text-white hidden sm:block">{user.username}</span>
                    <ChevronDownIcon />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-10 border border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={() => {
                                setCurrentPage('Profile');
                                setIsDropdownOpen(false);
                            }} 
                            className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            Profile
                        </button>
                        <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</a>
                        <button onClick={onLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <LogoutIcon />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    </header>
  );
};

export default Header;
