import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import SkeletonLoader from '../SkeletonLoader';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

const DashboardPage: React.FC = () => {
    const { user, setCurrentPage, transactions } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Tasks');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetching
        return () => clearTimeout(timer);
    }, []);

    if (!user) return <div>Loading...</div>;

    const xpPercentage = user.xpToNextLevel ? ((user.xp || 0) / user.xpToNextLevel) * 100 : 0;
    
    const renderTabContent = () => {
        if (isLoading) {
            return (
                <div className="p-6">
                    <SkeletonLoader className="h-8 w-full mb-2" />
                    <SkeletonLoader className="h-8 w-full mb-2" />
                    <SkeletonLoader className="h-8 w-full" />
                </div>
            )
        }
        
        const dataForTab = transactions.filter(tx => {
            if (activeTab === 'Withdrawals') return tx.type === 'Withdrawal';
            if (activeTab === 'Tasks') return tx.source === 'Task';
            if (activeTab === 'Surveys') return tx.source === 'Survey';
            if (activeTab === 'Offers') return tx.source === 'Offer';
            return false;
        });
        
        const headers = ['Method', 'ID', 'Category', 'Provider', 'Status', 'Total', 'Date'];

        return (
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                     <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-900/50">
                         <tr>
                             {headers.map(header => (
                                <th scope="col" key={header} className="px-6 py-3">{header}</th>
                             ))}
                         </tr>
                     </thead>
                     <tbody>
                        {dataForTab.length > 0 ? (
                            dataForTab.map((item) => (
                                <tr key={item.id} className="border-t border-slate-200 dark:border-slate-700">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{item.method}</td>
                                    <td className="px-6 py-4">{item.id}</td>
                                    <td className="px-6 py-4">{item.source || item.type}</td>
                                    <td className="px-6 py-4">N/A</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-green-500 dark:text-green-400">${item.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{item.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-t border-slate-200 dark:border-slate-700">
                                <td colSpan={headers.length} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <i className="fas fa-folder-open text-4xl text-slate-400 dark:text-slate-500"></i>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-300">No History Found</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Your completed {activeTab.toLowerCase()} will appear here.</p>
                                        <button 
                                            onClick={() => setCurrentPage(activeTab === 'Tasks' ? 'Tasks' : activeTab === 'Surveys' ? 'Surveys' : 'Offer')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform active:scale-95"
                                        >
                                            Browse {activeTab}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                     </tbody>
                 </table>
                 <div className="flex justify-center items-center p-4 border-t border-slate-200 dark:border-slate-700">
                     <button className="text-slate-400 dark:text-slate-500 mx-2" disabled>&lt;</button>
                     <button className="text-slate-400 dark:text-slate-500 mx-2" disabled>&gt;</button>
                 </div>
             </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* User Profile Section */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <img src={user.avatarUrl} alt={user.username} className="w-24 h-24 rounded-lg" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
                            <span className="bg-slate-100 dark:bg-slate-700 text-yellow-500 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">{user.rank}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Joined {user.joinedDate}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">ID: {user.id}</span>
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Earn ID: {user.earnId}</span>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-500 dark:text-slate-400">{(user.xp || 0).toLocaleString()} XP</span>
                                <span className="text-slate-900 dark:text-white">{(user.xpToNextLevel || 0).toLocaleString()} XP to next level</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard title="Total Earned" value={`$${(user.totalEarned || 0).toFixed(2)}`} icon="fas fa-dollar-sign" />
                        <StatCard title="Last 30 Days Earned" value={`$${(user.last30DaysEarned || 0).toFixed(2)}`} icon="fas fa-calendar-alt" />
                        <StatCard title="Completed Tasks" value={(user.completedTasks || 0).toString()} icon="fas fa-check-circle" />
                        <StatCard title="Total Wagered" value={`$${(user.totalWagered || 0).toFixed(2)}`} icon="fas fa-dice" />
                        <StatCard title="Total Profit" value={`$${(user.referralEarnings || 0).toFixed(2)}`} icon="fas fa-chart-line" />
                        <StatCard title="Total Withdrawn" value={`$${(user.totalWithdrawn || 0).toFixed(2)}`} icon="fas fa-university" />
                    </>
                )}
            </div>

            {/* Activity Tabs Section */}
             <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-800">
                 <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                     <div className="flex items-center space-x-2 overflow-x-auto">
                        {['Tasks', 'Surveys', 'Offers', 'Withdrawals', 'Openings', 'Battles'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === tab ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                {tab}
                            </button>
                        ))}
                     </div>
                 </div>
                 {renderTabContent()}
             </div>
        </div>
    );
};


interface StatCardProps {
    title: string;
    value: string;
    icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-100 dark:bg-slate-700 text-blue-500 dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center">
                <i className={`${icon} text-xl`}></i>
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    )
}

const StatCardSkeleton: React.FC = () => {
     return (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-800">
            <SkeletonLoader className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <SkeletonLoader className="h-4 w-24 mb-2" />
                <SkeletonLoader className="h-6 w-16" />
            </div>
        </div>
    )
}

export default DashboardPage;