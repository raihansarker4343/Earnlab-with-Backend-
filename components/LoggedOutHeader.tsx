
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
        <header className="bg-white dark:bg-[#141c2f] p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
                    aria-label="Open menu"
                >
                    <MenuIcon />
                </button>
                {isSidebarCollapsed && (
                    <button 
                        onClick={() => setIsSidebarCollapsed(false)} 
                        className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hidden lg:block"
                        aria-label="Open sidebar"
                    >
                        <MenuIcon />
                    </button>
                )}
                 <img 
                    src="https://res.cloudinary.com/dsezfqke7/image/upload/v1764430203/ligo_icon_final_111_jaxkf8.png"
                    alt="Earnello" 
                    className="h-8 cursor-pointer object-contain"
                    onClick={() => setCurrentPage('Home')}
                />
            </div>
             <div className="flex items-center gap-2">
                <button 
                    onClick={toggleTheme}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <button onClick={() => setIsSigninModalOpen(true)} className="border border-blue-600 text-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600/10 dark:text-white dark:border-white dark:hover:bg-white/10">Sign In</button>
                <button onClick={() => openSignupModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Sign Up</button>
            </div>
        </header>
    );
};

export default LoggedOutHeader;
