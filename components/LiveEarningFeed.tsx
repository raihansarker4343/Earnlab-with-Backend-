import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import type { EarningFeedItem } from '../types';

const LiveEarningFeed: React.FC = () => {
    const [feedItems, setFeedItems] = useState<EarningFeedItem[]>([]);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/public/earning-feed`);
                if (!response.ok) {
                    console.error("Failed to fetch earning feed data.");
                    return;
                }
                const data: EarningFeedItem[] = await response.json();
                setFeedItems(data);

            } catch (error) {
                console.error('Error fetching live earning feed:', error);
            }
        };

        fetchFeedData();
        
        // Refresh the feed every minute
        const interval = setInterval(fetchFeedData, 60000);
        
        return () => clearInterval(interval);

    }, []);

    if (feedItems.length === 0) {
        return null; // Don't render anything if there's no data
    }

    // Triplicate items for smoother infinite scroll on wider screens
    const duplicatedItems = [...feedItems, ...feedItems, ...feedItems];

  return (
    <div className="bg-white dark:bg-[#0b111e] border-b border-slate-200 dark:border-slate-800 overflow-hidden py-3 select-none">
      <div className="flex animate-marquee gap-4 hover:[animation-play-state:paused] items-center">
        {duplicatedItems.map((item, index) => {
          const isWithdrawal = item.task === 'Withdrawal';
          const providerName = isWithdrawal ? 'Cashout' : (item.provider || 'Offer');
          
          return (
            <div key={`${item.id}-${index}`} className="flex-shrink-0">
                {/* Card Container */}
                <div className="flex items-center bg-slate-100 dark:bg-[#1e2330] rounded-xl p-1.5 pr-3 min-w-[200px] border border-slate-200 dark:border-slate-700/50 shadow-sm group transition-colors hover:bg-slate-200 dark:hover:bg-[#252a38]">
                    
                    {/* Avatar */}
                    <div className="relative mr-3">
                        <img 
                            src={item.avatar} 
                            alt={item.user} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#2d3342]" 
                        />
                    </div>
                    
                    {/* Text Info */}
                    <div className="flex flex-col min-w-0 flex-1 mr-3">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                            {providerName}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] leading-tight">
                            {item.user}
                        </span>
                    </div>

                    {/* Amount Badge */}
                    <div className="bg-slate-200 dark:bg-[#0f1115] h-9 px-3 rounded-lg border border-slate-300 dark:border-white/10 flex items-center justify-center gap-1.5 shadow-inner">
                        <span className={`text-sm font-extrabold font-mono ${isWithdrawal ? 'text-red-500' : 'text-slate-500'}`}>
                            {Number(item.amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600 text-lg font-light leading-none mb-0.5">|</span>
                    </div>
                </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default LiveEarningFeed;