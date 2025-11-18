
import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import type { EarningFeedItem } from '../types';

const LiveEarningFeed: React.FC = () => {
    const [feedItems, setFeedItems] = useState<EarningFeedItem[]>([]);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/public/earning-feed`);
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data: EarningFeedItem[] = await response.json();
                setFeedItems(data);

            } catch (error) {
                console.error('Error fetching live earning feed:', error);
                // Retry after 5 seconds on failure
                setTimeout(() => setRetry(r => r + 1), 5000);
            }
        };

        fetchFeedData();
        
        // Refresh the feed every minute
        const interval = setInterval(fetchFeedData, 60000);
        
        return () => clearInterval(interval);

    }, [retry]);

    if (feedItems.length === 0) {
        return null; // Don't render anything if there's no data
    }

    const duplicatedItems = [...feedItems, ...feedItems];

  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-700 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        {duplicatedItems.map((item, index) => {
          const isWithdrawal = item.task === 'Withdrawal';
          return (
            <div key={`${item.id}-${index}`} className="flex items-center p-2 mx-4 flex-shrink-0">
              <img src={item.avatar} alt={item.user} className="w-6 h-6 rounded-full mr-2" />
              <div className="text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">{item.user}</span>
                  {isWithdrawal ? (
                      <span className="text-slate-500 dark:text-slate-400"> withdrew</span>
                  ) : (
                      <span className="text-slate-500 dark:text-slate-400"> earned from {item.task}</span>
                  )}
              </div>
              <span className={`ml-2 font-bold ${isWithdrawal ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                {isWithdrawal ? '-' : '+'}${(item.amount || 0).toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default LiveEarningFeed;
