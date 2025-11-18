
import React, { useState, useEffect } from 'react';
import type { User, Transaction } from '../../types';
import { API_URL } from '../../constants';
import StatusBadge from '../StatusBadge';

interface UserDetailPageProps {
    user: { id: number; email: string; };
    onBack: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg flex items-center gap-4 border border-slate-200">
        <div className="bg-slate-100 text-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
            <i className={`${icon} text-lg`}></i>
        </div>
        <div>
            <p className="text-slate-500 text-sm">{title}</p>
            <p className="text-lg font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const UserDetailPage: React.FC<UserDetailPageProps> = ({ user, onBack }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data for recent activity as it's not available from the backend
    const mockActivity = [
        { icon: 'fas fa-sign-in-alt', text: 'Logged in from New York, USA', time: '2 hours ago' },
        { icon: 'fas fa-check-circle', text: 'Completed task #T58291 for $2.50', time: '5 hours ago' },
        { icon: 'fas fa-university', text: 'Requested withdrawal of $25.00', time: '1 day ago' },
        { icon: 'fas fa-user-edit', text: 'Updated profile username', time: '2 days ago' },
        { icon: 'fas fa-sign-in-alt', text: 'Logged in from London, UK', time: '2 days ago' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found.");
                setIsLoading(false);
                return;
            }

            try {
                const [userRes, transactionsRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/users/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/admin/users/${user.id}/transactions`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!userRes.ok) throw new Error('Failed to fetch user details.');
                const fetchedUser: User = await userRes.json();
                setUserData(fetchedUser);

                if (!transactionsRes.ok) throw new Error('Failed to fetch user transactions.');
                const fetchedTransactions: Transaction[] = await transactionsRes.json();
                setTransactions(fetchedTransactions.map(tx => ({ ...tx, amount: Number(tx.amount) })));

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) {
            fetchData();
        }
    }, [user.id]);

    if (isLoading) return <div>Loading user details...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!userData) return <div>User not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <button onClick={onBack} className="text-sm text-blue-600 hover:underline mb-2">&larr; Back to List</button>
                    <div className="flex items-center gap-4">
                        <img src={userData.avatarUrl || `https://i.pravatar.cc/150?u=${userData.id}`} alt={userData.username} className="w-16 h-16 rounded-full" />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{userData.username}</h1>
                            <p className="text-slate-500">{userData.email || 'No email provided'}</p>
                        </div>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 rounded-md">Send Notification</button>
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md">Credit Balance</button>
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md">Ban User</button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Earned" value={`$${(userData.totalEarned || 0).toFixed(2)}`} icon="fas fa-dollar-sign" />
                <StatCard title="Current Balance" value={`$${(userData.balance || 0).toFixed(2)}`} icon="fas fa-wallet" />
                <StatCard title="Total Withdrawn" value={`$${(userData.totalWithdrawn || 0).toFixed(2)}`} icon="fas fa-university" />
                <StatCard title="Completed Tasks" value={(userData.completedTasks || 0).toString()} icon="fas fa-check-circle" />
            </div>

            {/* User Info, IP History & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-lg shadow-md space-y-4">
                        <h3 className="font-bold text-lg text-slate-800 border-b pb-2">User Information</h3>
                        <div className="text-sm space-y-2 text-slate-600">
                            <div className="flex justify-between"><span>User ID:</span> <span className="font-medium text-slate-800">{userData.id}</span></div>
                            <div className="flex justify-between"><span>Earn ID:</span> <span className="font-medium text-slate-800">{userData.earnId}</span></div>
                            <div className="flex justify-between"><span>Rank:</span> <span className="font-medium text-slate-800">{userData.rank}</span></div>
                            <div className="flex justify-between"><span>XP:</span> <span className="font-medium text-slate-800">{(userData.xp || 0).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Joined:</span> <span className="font-medium text-slate-800">{userData.joinedDate ? new Date(userData.joinedDate).toLocaleDateString() : 'N/A'}</span></div>
                            <div className="flex justify-between"><span>Status:</span> <span className="font-medium text-green-600">Active</span></div>
                        </div>
                    </div>

                     {/* IP Logs (History) Section */}
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">IP History</h3>
                        <div className="overflow-y-auto max-h-64">
                             {userData.ipHistory && userData.ipHistory.length > 0 ? (
                                <ul className="space-y-3">
                                    {userData.ipHistory.map((log, index) => (
                                        <li key={index} className="text-sm border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-semibold text-slate-700">{log.ip}</span>
                                                    {log.isBlocked && (
                                                         <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">
                                                            {log.blockType || 'Blocked'}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-500">{new Date(log.lastSeen).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex justify-between">
                                                <span>{log.country || 'Unknown'}</span>
                                                <span>{log.isp || 'Unknown'}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500">No IP history recorded.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Recent Activity (Mock) */}
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Recent Activity</h3>
                        <ul className="relative border-l border-slate-200 ml-3">
                            {mockActivity.map((activity, index) => (
                                <li key={index} className="mb-6 ml-6 last:mb-0">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                        <i className={`${activity.icon} text-blue-600 text-xs`}></i>
                                    </span>
                                    <p className="text-sm font-normal text-slate-700">{activity.text}</p>
                                    <time className="block text-xs font-normal leading-none text-slate-400 mt-0.5">{activity.time}</time>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Transaction History</h3>
                    <div className="overflow-auto max-h-[calc(32rem)]">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-slate-50">
                                <tr className="text-left text-slate-500">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {transactions.length > 0 ? (
                                    transactions.map(tx => (
                                        <tr key={tx.id} className="border-t border-slate-200">
                                            <td className="p-2 font-mono text-xs">{tx.id}</td>
                                            <td className="p-2">{tx.type}</td>
                                            <td className={`p-2 font-bold ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-green-500'}`}>${(tx.amount || 0).toFixed(2)}</td>
                                            <td className="p-2">
                                                <StatusBadge status={tx.status} />
                                            </td>
                                            <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-slate-500">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;