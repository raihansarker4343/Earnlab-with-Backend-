import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { SidebarMenuItem } from '../types';
import { HomeIcon, BlogIcon, GuideIcon, SupportIcon } from './icons/SidebarIcons';

const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Blog', icon: <BlogIcon /> },
  { name: 'Guides', icon: <GuideIcon /> },
  { name: 'Live Support', icon: <SupportIcon />, action: 'openSupportChat' },
];

const LoggedOutSidebar: React.FC = () => {
    const {
      currentPage,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      setCurrentPage,
      setIsSupportChatModalOpen,
    } = useContext(AppContext);

    const handleClose = () => {
        setIsSidebarCollapsed(true);
        setIsMobileSidebarOpen(false);
    };

    const handleLinkClick = (pageName?: string, action?: string) => {
        if (action === 'openSupportChat') {
            if (typeof setIsSupportChatModalOpen === 'function') {
                setIsSupportChatModalOpen(true);
            }
        } else if (pageName) {
            if (typeof setCurrentPage === 'function') {
                setCurrentPage(pageName);
            } else {
                const path = pageName === 'Home' ? '/' : `/${pageName.replace(/[^a-zA-Z0-9]/g, '')}`;
                if (window.location.pathname !== path) {
                    const { search } = window.location;
                    window.history.pushState({}, '', path + search);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        }
        setIsMobileSidebarOpen(false);
    };

    const renderMenuItem = (item: SidebarMenuItem) => {
        const isActive = currentPage === item.name;
        
        // Base container styles
        const baseClasses = `group relative w-full flex items-center justify-between text-left px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium border overflow-hidden`;
        
        // Active vs Inactive state styles (Glassmorphism)
        const stateClasses = isActive
            ? 'bg-gradient-to-r from-white/60 to-white/20 dark:from-white/15 dark:to-white/5 text-indigo-900 dark:text-white border-white/60 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] backdrop-blur-md'
            : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/30 dark:hover:bg-white/5 hover:border-white/30 dark:hover:border-white/5 hover:shadow-sm hover:backdrop-blur-sm hover:text-slate-900 dark:hover:text-slate-200';

        // Icon container styles
        const iconBase = `relative grid place-items-center w-10 h-10 rounded-xl transition-all duration-300`;
        const iconActive = `bg-indigo-500 text-white shadow-lg shadow-indigo-500/30`;
        const iconInactive = `bg-white/40 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-white/60 dark:group-hover:bg-white/10 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:scale-105`;

        return (
            <li key={item.name}>
                <button
                    onClick={() => handleLinkClick(item.name, item.action)}
                    className={`${baseClasses} ${stateClasses}`}
                >
                    <div className="flex items-center space-x-3.5">
                        <span className={`${iconBase} ${isActive ? iconActive : iconInactive}`}>
                            {item.icon}
                        </span>
                        <span className="relative z-10 text-sm font-semibold tracking-wide">
                            {item.name}
                            {item.action === 'openSupportChat' && (
                                <span className="ml-2 text-[10px] uppercase tracking-wider font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 px-2 py-0.5 rounded-full shadow-sm">
                                    Live
                                </span>
                            )}
                        </span>
                    </div>
                    
                    {/* Active State Indicator */}
                    {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                    )}
                </button>
            </li>
        );
    };

  return (
    <>
        {/* Mobile Overlay with heavy blur */}
        <div 
            className={`fixed inset-0 bg-slate-900/30 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500 ease-out ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
        ></div>

        <aside className={`
  fixed top-0 left-0 inset-y-0 z-50
  lg:sticky lg:top-0
  h-[100dvh] lg:h-screen

  flex flex-col overflow-hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)

  lg:w-72 ${isSidebarCollapsed ? 'lg:w-0 lg:p-0' : ''}
  ${isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0'}

  bg-white/70 dark:bg-[#0f1729]/80
  backdrop-blur-2xl
  border-r border-white/20 dark:border-white/5
  shadow-[10px_0_40px_-10px_rgba(0,0,0,0.05)]
`}>


          
            {/* Ambient Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[40%] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[50%] bg-cyan-500/10 rounded-full blur-[90px]"></div>
            </div>

            <div className="p-6 flex flex-col flex-1 min-w-[18rem] h-full overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-200/50 dark:scrollbar-thumb-slate-700/50">
                
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/30 ring-2 ring-white/20 dark:ring-white/5">
                            E
                         </div>
                         <div className="flex flex-col">
                             <span className="font-bold text-xl text-slate-800 dark:text-white leading-none tracking-tight">Earnello</span>
                         </div>
                    </div>

                    <button 
                        onClick={handleClose} 
                        className="p-2 rounded-xl bg-white/40 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-all border border-white/40 dark:border-white/5 backdrop-blur-sm shadow-sm"
                        aria-label="Close sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                

                {/* Navigation Menu */}
                <nav className="flex-1 flex flex-col">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Menu</h3>
                    <ul className="space-y-3">
                        {SIDEBAR_MENU_ITEMS.map(renderMenuItem)}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-white/5">
                    <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <i className="fab fa-discord text-slate-600 dark:text-slate-400 hover:text-indigo-500 cursor-pointer text-lg"></i>
                        <i className="fab fa-twitter text-slate-600 dark:text-slate-400 hover:text-sky-500 cursor-pointer text-lg"></i>
                        <i className="fab fa-instagram text-slate-600 dark:text-slate-400 hover:text-pink-500 cursor-pointer text-lg"></i>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-medium mt-3">
                        © 2025 Earnello Inc.
                    </p>
                </div>
            </div>
        </aside>
    </>
  );
};

export default LoggedOutSidebar;
