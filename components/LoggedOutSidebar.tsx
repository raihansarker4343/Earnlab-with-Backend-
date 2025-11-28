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
    // include setCurrentPage and setIsSupportChatModalOpen from context
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
        // special actions (e.g., open support chat)
        if (action === 'openSupportChat') {
            if (typeof setIsSupportChatModalOpen === 'function') {
                setIsSupportChatModalOpen(true);
            }
        } else if (pageName) {
            // change current page via app context
            if (typeof setCurrentPage === 'function') {
                setCurrentPage(pageName);
            } else {
                // fallback: change URL to trigger App's popstate handler
                const path = pageName === 'Home' ? '/' : `/${pageName.replace(/[^a-zA-Z0-9]/g, '')}`;
                if (window.location.pathname !== path) {
                    const { search } = window.location;
                    window.history.pushState({}, '', path + search);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        }

        // always close mobile sidebar on click
        setIsMobileSidebarOpen(false);
    };

    const renderMenuItem = (item: SidebarMenuItem) => {
    const isActive = currentPage === item.name;
    const baseClasses = `group relative w-full flex items-center justify-between text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium border overflow-hidden`;
    const stateClasses = isActive
        ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/12 to-cyan-500/15 text-slate-900 dark:text-white border-indigo-200/40 dark:border-indigo-400/30 shadow-lg shadow-indigo-500/15'
        : 'text-slate-500 dark:text-slate-400 border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-300/60 dark:hover:border-indigo-400/50 hover:shadow-md hover:shadow-indigo-500/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur';

    return (
        <li key={item.name}>
            <button
                onClick={() => handleLinkClick(item.name, item.action)}
                className={`${baseClasses} ${stateClasses}`}
            >
                <div className="flex items-center space-x-3">
                    <span className="relative grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-cyan-500/20 text-indigo-600 dark:text-indigo-200 border border-white/30 dark:border-slate-800/60 shadow-inner shadow-indigo-500/10">
                        <span className="absolute inset-0 rounded-lg bg-white/30 dark:bg-white/5 blur-sm" aria-hidden="true"></span>
                        <span className="relative z-10">{item.icon}</span>
                    </span>
                    <span className="relative z-10">
                        {item.name}
                        {item.action === 'openSupportChat' && (
                            <span className="ml-2 text-[11px] uppercase tracking-wide text-indigo-600 dark:text-indigo-200 font-semibold bg-white/60 dark:bg-white/5 px-2 py-0.5 rounded-full border border-white/50 dark:border-white/10">
                                Live
                            </span>
                        )}
                    </span>
                </div>
            </button>
        </li>
        );
    };

  return (
    <>
        {/* Mobile Overlay */}
        <div 
            className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
        ></div>

        <aside className={`relative bg-white/90 dark:bg-[#0f1729]/95 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 overflow-hidden
    fixed lg:sticky top-0 h-screen z-50
    lg:w-64 ${isSidebarCollapsed ? 'lg:w-0 lg:p-0' : ''}
    ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0'}
`}>
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/15 via-transparent to-cyan-500/10 dark:from-indigo-500/20 dark:via-transparent dark:to-cyan-500/15 pointer-events-none" aria-hidden="true"></div>
    <div className="absolute inset-0 border border-white/30 dark:border-white/5 rounded-r-3xl pointer-events-none" aria-hidden="true"></div>
    <div className="p-4 flex flex-col flex-1 min-w-[16rem] h-full overflow-y-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
                <div className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/20 text-indigo-600 dark:text-indigo-200 border border-white/50 dark:border-white/10">Explore & Earn</div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earnello.com</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Navigate offers, guides, and live support with a polished, gradient-lit sidebar.</p>
            </div>
            <button onClick={handleClose} className="p-2 rounded-lg bg-white/70 text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm border border-white/60 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-white dark:border-slate-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <div className="mb-6 p-4 rounded-2xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-indigo-500/12 via-white to-cyan-500/10 dark:from-indigo-500/15 dark:via-slate-900/70 dark:to-cyan-500/12 shadow-lg shadow-indigo-500/10">
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-white/70 dark:bg-white/5 text-indigo-600 dark:text-indigo-200 border border-white/60 dark:border-white/10">New</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Discover fresh surveys, games, and premium support—curated daily.</p>
        </div>

        <nav className="flex-1 flex flex-col">
            <ul className="space-y-2">
                {SIDEBAR_MENU_ITEMS.map(renderMenuItem)}
            </ul>
        </nav>
    </div>
        </aside>
    </>
  );
};

export default LoggedOutSidebar;