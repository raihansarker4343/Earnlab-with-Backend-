import React, { useState, useEffect } from 'react';
import type { User, Transaction } from '../../types';
import { API_URL } from '../../constants';

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

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Failed': return 'bg-red-100 text-red-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const UserDetailPage: React.FC<UserDetailPageProps> = ({ user, onBack }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

            {/* User Info & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-md space-y-4">
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
                <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Transaction History</h3>
                    <div className="overflow-auto max-h-96">
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
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(tx.status)}`}>
                                                    {tx.status}
                                                </span>
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