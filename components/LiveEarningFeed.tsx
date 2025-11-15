import React from 'react';
import { EARNING_FEED_ITEMS } from '../constants';

const LiveEarningFeed: React.FC = () => {
    const duplicatedItems = [...EARNING_FEED_ITEMS, ...EARNING_FEED_ITEMS];

  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-700 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        {duplicatedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center p-2 mx-4 flex-shrink-0">
            <img src={item.avatar} alt={item.user} className="w-6 h-6 rounded-full mr-2" />
            <div className="text-sm">
                <span className="font-bold text-slate-900 dark:text-white">{item.task}</span>
                <span className="text-slate-500 dark:text-slate-400"> - {item.provider}</span>
            </div>
            <span className="ml-2 text-green-500 dark:text-green-400 font-bold">${item.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEarningFeed;