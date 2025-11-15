import React, { useState, useEffect } from 'react';

const DAILY_REWARDS = [
    { day: 1, reward: 25, unit: 'XP' },
    { day: 2, reward: 50, unit: 'XP' },
    { day: 3, reward: 100, unit: 'XP' },
    { day: 4, reward: 0.05, unit: '$' },
    { day: 5, reward: 250, unit: 'XP' },
    { day: 6, reward: 500, unit: 'XP' },
    { day: 7, reward: 1.00, unit: '$' },
];

const DailyBonusPage: React.FC = () => {
    const [currentStreak, setCurrentStreak] = useState(() => {
        const savedStreak = localStorage.getItem('dailyBonusStreak');
        return savedStreak ? parseInt(savedStreak, 10) : 0;
    });
    const [lastClaimed, setLastClaimed] = useState(() => {
        const savedDate = localStorage.getItem('lastClaimedDate');
        return savedDate ? new Date(savedDate) : null;
    });

    const canClaim = () => {
        if (!lastClaimed) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastClaimedDate = new Date(lastClaimed);
        lastClaimedDate.setHours(0, 0, 0, 0);
        return today > lastClaimedDate;
    };
    
    const [isClaimable, setIsClaimable] = useState(canClaim());

    useEffect(() => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        if (lastClaimed && lastClaimed.toDateString() !== yesterday.toDateString() && lastClaimed.toDateString() !== today.toDateString()) {
           // Streak broken
           setCurrentStreak(0);
           localStorage.setItem('dailyBonusStreak', '0');
        }
    }, [lastClaimed]);


    const handleClaim = () => {
        if (!isClaimable) return;
        
        const newStreak = currentStreak + 1;
        const today = new Date();
        
        setCurrentStreak(newStreak > 7 ? 1 : newStreak);
        setLastClaimed(today);
        setIsClaimable(false);

        localStorage.setItem('dailyBonusStreak', (newStreak > 7 ? 1 : newStreak).toString());
        localStorage.setItem('lastClaimedDate', today.toISOString());

        // You would typically also add the reward to the user's balance/XP here.
        alert(`You claimed your Day ${currentStreak + 1} reward!`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Daily Streak Rewards</h1>
                <p className="text-slate-500 dark:text-slate-400">Log in every day to claim your reward and keep your streak going!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {DAILY_REWARDS.map(({ day, reward, unit }) => {
                    const isClaimed = day <= currentStreak;
                    const isNext = day === currentStreak + 1;
                    return (
                        <div key={day} className={`p-6 rounded-lg text-center border-2 ${isNext && isClaimable ? 'border-yellow-400 bg-yellow-400/10' : 'border-slate-200 dark:border-slate-800'} ${isClaimed ? 'bg-slate-100 dark:bg-slate-800 opacity-60' : 'bg-white dark:bg-[#1e293b]'}`}>
                            <p className="font-bold text-sm text-slate-500 dark:text-slate-400">Day {day}</p>
                            <div className="my-4 text-4xl">
                                {unit === 'XP' ? <i className="fas fa-star text-yellow-400"></i> : <i className="fas fa-dollar-sign text-green-400"></i>}
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {unit === '$' && '$'}{reward.toLocaleString()}{unit === 'XP' && ' XP'}
                            </p>
                            {isClaimed && <p className="text-xs font-bold text-green-500 mt-2">CLAIMED</p>}
                        </div>
                    );
                })}
            </div>
            
            <div className="text-center">
                 <button 
                    onClick={handleClaim}
                    disabled={!isClaimable}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg disabled:bg-slate-500 dark:disabled:bg-slate-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95"
                >
                    {isClaimable ? `Claim Day ${currentStreak + 1} Reward` : 'Come back tomorrow!'}
                </button>
            </div>
        </div>
    );
};

export default DailyBonusPage;