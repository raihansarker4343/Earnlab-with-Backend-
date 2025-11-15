import React, { useState, useContext } from 'react';
import { LEADERBOARD_USERS } from '../../constants';
import { AppContext } from '../../App';
import type { LeaderboardUser } from '../../types';

const LeaderboardPage: React.FC = () => {
    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Weekly');
    
    const currentUserData = LEADERBOARD_USERS.find(u => u.user === user?.username);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Leaderboard</h1>
                <p className="text-slate-500 dark:text-slate-400">See who's at the top and compete for exclusive prizes.</p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {['Daily', 'Weekly', 'Monthly'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === tab ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Resets in 3d 14h 22m
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Rank</th>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3 text-right">Earned</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-800 dark:text-slate-300">
                            {LEADERBOARD_USERS.map((leader, index) => (
                                <tr key={index} className={`border-t border-slate-200 dark:border-slate-800 ${leader.user === user?.username ? 'bg-blue-500/10' : ''}`}>
                                    <td className="px-6 py-4 font-bold text-lg w-16 text-center">
                                        {leader.rank === 1 && <i className="fas fa-trophy text-yellow-400"></i>}
                                        {leader.rank === 2 && <i className="fas fa-trophy text-gray-400"></i>}
                                        {leader.rank === 3 && <i className="fas fa-trophy text-orange-400"></i>}
                                        {leader.rank > 3 && leader.rank}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={leader.avatar} alt={leader.user} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{leader.user}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Level {leader.level}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-green-500 dark:text-green-400">
                                        ${leader.earned.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {currentUserData && (
                     <div className="p-4 border-t-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 sticky bottom-0">
                         <div className="flex items-center justify-between text-sm font-bold">
                            <div className="flex items-center gap-4">
                               <span className="text-slate-900 dark:text-white">#{currentUserData.rank}</span>
                                <div className="flex items-center gap-2">
                                    <img src={currentUserData.avatar} alt={currentUserData.user} className="w-6 h-6 rounded-full" />
                                    <span className="text-slate-900 dark:text-white">{currentUserData.user}</span>
                               </div>
                            </div>
                             <span className="text-green-500 dark:text-green-400">${currentUserData.earned.toFixed(2)}</span>
                         </div>
                     </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
