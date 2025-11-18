import React, { useContext } from 'react';
import { AppContext } from '../types';
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
        const baseClasses = `w-full flex items-center justify-between text-left px-4 py-3 rounded-lg transition-colors duration-200 font-medium`;
        
        let stateClasses = 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white';

        if (item.isSpecial) {
            stateClasses = 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/50 hover:bg-yellow-400/20';
        } else if (isActive) {
            stateClasses = 'bg-slate-100 text-slate-900 dark:bg-[#1e293b] dark:text-white font-semibold';
        }

        return (
            <li key={item.name}>
                <button
                    onClick={() => handleLinkClick(item.name, item.action)}
                    className={`${baseClasses} ${stateClasses}`}
                >
                    <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.name}</span>
                    </div>
                    {item.isHot && <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">Hot</span>}
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

      <aside className={`bg-white dark:bg-[#141c2f] flex flex-col transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 overflow-hidden
          fixed lg:sticky top-0 h-screen z-50 
          lg:w-64 ${isSidebarCollapsed ? 'lg:w-0 lg:p-0' : ''}
          ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0'}
      `}>
          <div className="p-4 flex flex-col flex-1 min-w-[16rem] h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">EarnLab</h1>
                  <button onClick={handleClose} className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>

              <nav className="flex-1 flex flex-col">
                  <ul className="space-y-1">
                      {SIDEBAR_MENU_ITEMS_TOP.map(renderMenuItem)}
                  </ul>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
                   <ul className="space-y-1">
                      {SIDEBAR_MENU_ITEMS_COMMUNITY.map(renderMenuItem)}
                  </ul>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
                  <ul className="space-y-1">
                      {SIDEBAR_MENU_ITEMS_BOTTOM.map(renderMenuItem)}
                  </ul>
              </nav>
          </div>
      </aside>
    </>
  );
};

export default Sidebar;