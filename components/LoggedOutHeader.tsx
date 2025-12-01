
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { MenuIcon } from './icons/HeaderIcons';
import { MoonIcon, SunIcon } from './icons/FooterIcons';

const LoggedOutHeader: React.FC = () => {
    const { isSidebarCollapsed, setIsSidebarCollapsed, setIsMobileSidebarOpen, theme, setTheme, setIsSigninModalOpen, openSignupModal, setCurrentPage } = useContext(AppContext);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="relative bg-white/70 dark:bg-[#0f1729]/80 backdrop-blur-2xl p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-30">
            <div className="flex items-center gap-4">
                 <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 lg:hidden border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                    aria-label="Open menu"
                >
                    <MenuIcon />
                </button>
                {isSidebarCollapsed && (
                    <button 
                        onClick={() => setIsSidebarCollapsed(false)} 
                        className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hidden lg:block transition-all active:scale-95 border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                        aria-label="Open sidebar"
                    >
                        <MenuIcon />
                    </button>
                )}
                 <img 
                    src="https://res.cloudinary.com/dsezfqke7/image/upload/v1764430203/ligo_icon_final_111_jaxkf8.png"
                    alt="Earnello" 
                    className="h-9 cursor-pointer object-contain hover:scale-105 transition-transform drop-shadow-sm"
                    onClick={() => setCurrentPage('Home')}
                />
            </div>
             <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end w-full sm:w-auto">
                <button 
                    onClick={toggleTheme}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-yellow-400 p-2.5 rounded-full hover:bg-slate-100/60 dark:hover:bg-white/10 transition-all active:scale-90 active:rotate-12"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <button 
                    onClick={() => setIsSigninModalOpen(true)} 
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all active:scale-95"
                >
                    Sign In
                </button>
                <button 
                    onClick={() => openSignupModal()} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center"
                >
                    Sign Up
                </button>
            </div>
        </header>
    );
};

export default LoggedOutHeader;
