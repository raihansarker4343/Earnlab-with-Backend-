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
    const baseClasses = `w-full group flex items-center justify-between text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium border border-transparent bg-white/0 dark:bg-transparent`;

    let stateClasses = 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 hover:border-slate-200/60 dark:hover:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]';

    if (item.isSpecial) {
        stateClasses = 'text-amber-400 hover:text-amber-300 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-400/40 shadow-[0_10px_30px_-15px_rgba(245,158,11,0.5)]';
    } else if (isActive) {
        stateClasses = 'text-slate-900 dark:text-white bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-sky-500/30 shadow-lg shadow-sky-900/10 dark:shadow-sky-900/30 font-semibold backdrop-blur';
    }

    return (
        <li key={item.name}>
            <button
                onClick={() => handleLinkClick(item.name, item.action)}
                className={`${baseClasses} ${stateClasses}`}
            >
                <div className="flex items-center space-x-3">
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-white/90 via-slate-100/60 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/0 border border-white/60 dark:border-white/10 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] group-hover:scale-105 transition-transform">{item.icon}</span>
                    <span className="tracking-tight">{item.name}</span>
                </div>
                {item.isHot && <span className="text-xs bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold px-2 py-0.5 rounded-full shadow-sm">Hot</span>}
            </button>
        </li>
    );
};

  return (
    <>
      {/* Mobile Overlay */}
      <div 
          className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity backdrop-blur-sm ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
      ></div>

      <aside className={`relative bg-gradient-to-b from-slate-900/10 via-sky-500/10 to-transparent dark:from-slate-900/40 dark:via-sky-500/15 dark:to-transparent p-[1px] rounded-2xl shadow-[0_20px_60px_-35px_rgba(15,23,42,0.7)] transition-all duration-300 ease-in-out overflow-hidden
    fixed lg:sticky top-0 h-screen z-50
    lg:w-64 ${isSidebarCollapsed ? 'lg:w-0 lg:p-0' : ''}
    ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0'}
`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.12),transparent_35%)]" aria-hidden="true"></div>
    <div className="relative h-full bg-white/85 dark:bg-[#0f1729]/90 backdrop-blur-xl border border-white/30 dark:border-white/5 rounded-2xl flex flex-col">
        <div className="p-4 flex flex-col flex-1 min-w-[16rem] h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 text-sky-700 dark:text-sky-200 border border-sky-500/30">Navigation</span>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earnello.com</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Glide through offers and rewards with a focused hub.</p>
                </div>
                <button onClick={handleClose} className="p-2 rounded-lg bg-white/70 text-slate-500 hover:bg-white dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 border border-slate-200/70 dark:border-white/10 shadow-sm backdrop-blur">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <nav className="flex-1 flex flex-col space-y-5">
                <div className="p-3 rounded-2xl border border-white/60 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-2">Explore</p>
                    <ul className="space-y-2">
                        {SIDEBAR_MENU_ITEMS_TOP.map(renderMenuItem)}
                    </ul>
                </div>
                <div className="p-3 rounded-2xl border border-white/60 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-2">Community</p>
                    <ul className="space-y-2">
                        {SIDEBAR_MENU_ITEMS_COMMUNITY.map(renderMenuItem)}
                    </ul>
                </div>
                <div className="p-3 rounded-2xl border border-white/60 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-2">More</p>
                    <ul className="space-y-2">
                        {SIDEBAR_MENU_ITEMS_BOTTOM.map(renderMenuItem)}
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</aside>
    </>
  );
};

export default Sidebar;