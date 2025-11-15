import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { BellIcon, ChevronDownIcon, WalletIcon, LogoutIcon, MenuIcon } from './icons/HeaderIcons';
import { MoonIcon, SunIcon } from './icons/FooterIcons';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const { user, balance, setIsWalletModalOpen, isSidebarCollapsed, setIsSidebarCollapsed, setCurrentPage, setIsMobileSidebarOpen, theme, setTheme } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
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
                <i className="fas fa-dollar-sign"></i>
                <span>{balance.toFixed(2)}</span>
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
            <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 transition-transform active:scale-95">
                <BellIcon />
            </button>
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