import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { SidebarMenuItem } from '../types';
import { HomeIcon, EarnIcon, TaskIcon, SurveyIcon, RewardIcon, AffiliateIcon, BlogIcon, GuideIcon, SupportIcon, LeaderboardIcon, DailyBonusIcon, AchievementIcon, ChatIcon } from './icons/SidebarIcons';

const SIDEBAR_MENU_ITEMS_TOP: SidebarMenuItem[] = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Offer', icon: <EarnIcon /> },
  { name: 'Tasks', icon: <TaskIcon /> },
  { name: 'Surveys', icon: <SurveyIcon /> },
];

const SIDEBAR_MENU_ITEMS_COMMUNITY: SidebarMenuItem[] = [
  { name: 'Leaderboard', icon: <LeaderboardIcon /> },
  { name: 'Achievements', icon: <AchievementIcon /> },
  { name: 'Daily Bonus', icon: <DailyBonusIcon />, isSpecial: true },
  { name: 'Chat', icon: <ChatIcon /> },
];

const SIDEBAR_MENU_ITEMS_BOTTOM: SidebarMenuItem[] = [
  { name: 'Rewards', icon: <RewardIcon /> },
  { name: 'Referrals', icon: <AffiliateIcon /> },
  { name: 'Blog', icon: <BlogIcon /> },
  { name: 'Guides', icon: <GuideIcon /> },
  { name: 'Live Support', icon: <SupportIcon />, action: 'openSupportChat' },
];

const Sidebar: React.FC = () => {
    const { currentPage, setCurrentPage, isSidebarCollapsed, setIsSidebarCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen, setIsSupportChatModalOpen } = useContext(AppContext);

    const handleClose = () => {
        setIsSidebarCollapsed(true);
        setIsMobileSidebarOpen(false);
    };
    
    const handleLinkClick = (pageName: string, action?: string) => {
        if (action === 'openSupportChat') {
            setIsSupportChatModalOpen(true);
        } else {
            setCurrentPage(pageName);
        }
        setIsMobileSidebarOpen(false);
    };


    const renderMenuItem = (item: SidebarMenuItem) => {
    const isActive = currentPage === item.name;
    const baseClasses = `w-full group flex items-center justify-between text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium border border-transparent relative overflow-hidden`;

    let stateClasses = '';
    let iconClasses = '';

    if (item.isSpecial) {
        // Special Gold/Amber Glass
        stateClasses = 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-500/20 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-sm';
        iconClasses = 'text-amber-500 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30';
    } else if (isActive) {
        // Active Blue Glass
        stateClasses = 'text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-500/20 shadow-sm backdrop-blur-md';
        iconClasses = 'text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-white/10 shadow-sm';
    } else {
        // Default Inactive (Ghost)
        stateClasses = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 hover:border-white/40 dark:hover:border-white/10';
        iconClasses = 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 bg-slate-100/50 dark:bg-slate-800/50 group-hover:bg-white/60 dark:group-hover:bg-white/10';
    }

    return (
        <li key={item.name}>
            <button
                onClick={() => handleLinkClick(item.name, item.action)}
                className={`${baseClasses} ${stateClasses}`}
            >
                {/* Active glow effect */}
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-50 pointer-events-none"></div>}

                <div className="flex items-center space-x-3 relative z-10">
                    <span className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${iconClasses}`}>
                        {item.icon}
                    </span>
                    <span className="tracking-tight">{item.name}</span>
                </div>
                {item.isHot && <span className="relative z-10 text-[10px] uppercase font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/30">Hot</span>}
            </button>
        </li>
    );
};

  return (
    <>
      {/* Mobile Overlay */}
      <div 
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300 ease-out ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
      ></div>

      <aside className={`relative flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden
            fixed lg:sticky top-0 h-screen z-50
            lg:w-72 ${isSidebarCollapsed ? 'lg:w-0 lg:p-0' : ''}
            ${isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0'}
            
            /* Glassmorphism Container */
            bg-white/70 dark:bg-[#0f1729]/80 
            backdrop-blur-2xl 
            border-r border-white/20 dark:border-white/5 
            shadow-[10px_0_40px_-10px_rgba(0,0,0,0.05)]
      `}>
        {/* Ambient Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-30%] w-[80%] h-[40%] bg-blue-500/10 rounded-full blur-[80px] opacity-70"></div>
            <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[50%] bg-purple-500/10 rounded-full blur-[90px] opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200/50 dark:scrollbar-thumb-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/30 ring-2 ring-white/20 dark:ring-white/5">
                        E
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl text-slate-800 dark:text-white leading-none tracking-tight">Earnello</span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5 opacity-80">Gateway</span>
                    </div>
                </div>
                <button onClick={handleClose} className="p-2 rounded-xl bg-white/40 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-all border border-transparent hover:border-white/20 dark:hover:border-white/5 backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Menu Sections */}
            <nav className="flex-1 flex flex-col space-y-6">
                <div>
                    <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Explore</p>
                    <ul className="space-y-1.5">
                        {SIDEBAR_MENU_ITEMS_TOP.map(renderMenuItem)}
                    </ul>
                </div>
                
                <div>
                    <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Community</p>
                    <ul className="space-y-1.5">
                        {SIDEBAR_MENU_ITEMS_COMMUNITY.map(renderMenuItem)}
                    </ul>
                </div>

                <div>
                    <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Support & More</p>
                    <ul className="space-y-1.5">
                        {SIDEBAR_MENU_ITEMS_BOTTOM.map(renderMenuItem)}
                    </ul>
                </div>
            </nav>

            {/* Footer / Copyright */}
            <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-white/5 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    © 2025 Earnello.com
                </p>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;