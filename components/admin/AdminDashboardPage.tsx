import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import type { Transaction, User } from '../../types';
import { API_URL } from '../../constants';

const StatCard: React.FC<{ title: string, value: string, icon: string, color: string }> = ({ title, value, icon, color }) => (
    <div className={`p-5 rounded-lg text-white shadow-md`} style={{ background: color }}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-4xl font-bold">{value}</p>
            </div>
            <div className="text-5xl opacity-80">
                <i className={icon}></i>
            </div>
        </div>
        <div className="mt-4 text-right">
            <a href="#" className="text-sm hover:underline">View All</a>
        </div>
    </div>
);

const CircleStat: React.FC<{ title: string, value: string, percentage: number, color: string }> = ({ title, value, percentage, color }) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center">
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    className="text-slate-200"
                    strokeWidth="3"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                    className={color}
                    strokeWidth="3"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeDasharray={`${percentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-700">{value}</div>
        </div>
        <p className="mt-3 font-semibold text-slate-600">{title}</p>
    </div>
);

const recentTaskCompletions = [
    { transaction: 'DnRQ1762848905', date: '2025-11-11', user: 'testuser1@gmail.com', amount: '$28.13' },
    { transaction: 'ZVcvy1762669353', date: '2025-11-09', user: 'web4evrs@gmail.com', amount: '$47.85' },
    { transaction: 'ft7V1762669281', date: '2025-11-09', user: 'eliassemboy@gmail.com', amount: '$24.01' },
    { transaction: '8in61762004826', date: '2025-11-01', user: 'alazarcherzav142@gmail.com', amount: '$1.11' },
];

const recentSignups = [
    { email: 'testbd@gmail.com', joined: '2025-10-06 02:46:54' },
    { email: 'web4evrs@gmail.com', joined: '2025-09-08 17:46:59' },
    { email: 'eliassemboy@gmail.com', joined: '2025-07-26 14:06:50' },
    { email: 'alazarcherzav142@gmail.com', joined: '2025-06-20 16:27:39' },
];


const AdminDashboardPage: React.FC = () => {
    const { setUser, setBalance, setTransactions: setGlobalTransactions } = useContext(AppContext);
    const [withdrawalRequests, setWithdrawalRequests] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWithdrawals = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/admin/transactions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch withdrawal requests.");
            const data: Transaction[] = await response.json();
            setWithdrawalRequests(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const updateTransactionStatus = async (txId: string, status: 'Completed' | 'Rejected'): Promise<Transaction | null> => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Admin not authenticated.");
            return null;
        }
        try {
            const response = await fetch(`${API_URL}/api/admin/transactions/${txId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update transaction.');
            }
            const updatedTx: Transaction = await response.json();
            
            setWithdrawalRequests(prev => prev.map(t => t.id === txId ? updatedTx : t));
            setGlobalTransactions(prev => prev.map(t => t.id === txId ? updatedTx : t));
            
            return updatedTx;
        } catch (error: any) {
            alert(`Error: ${error.message}`);
            return null;
        }
    };

    const handleApprove = async (txId: string) => {
        const tx = withdrawalRequests.find(t => t.id === txId);
        if (!tx) return;
        
        const updatedTx = await updateTransactionStatus(txId, 'Completed');
        if (!updatedTx) return;

        // The backend updated user's total_withdrawn. We update the local user state
        // to match, so the UI is consistent without a page reload.
        setUser(prevUser => {
            if (!prevUser) return null;
            // This assumes the admin is acting on the currently logged in user's transaction,
            // which fits the single-user simulation of this app.
            const newTotalWithdrawn = (prevUser.totalWithdrawn || 0) + tx.amount;
            const updatedUser = { ...prevUser, totalWithdrawn: newTotalWithdrawn };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist change locally
            return updatedUser;
        });
    };

    const handleReject = async (txId: string) => {
        const tx = withdrawalRequests.find(t => t.id === txId);
        if (!tx) return;
        
        const updatedTx = await updateTransactionStatus(txId, 'Rejected');
        if (!updatedTx) return;

        // For this simulation, if the rejected transaction belongs to the current user,
        // we add the amount back to their balance.
        // In a real multi-user system, this logic would be more complex.
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if(currentUser && currentUser.id === tx.userId) {
             setBalance(prevBalance => prevBalance + tx.amount);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Pending Withdrawals!" value={withdrawalRequests.filter(w => w.status === 'Pending').length.toString()} icon="fas fa-dollar-sign" color="linear-gradient(to right, #ef4444, #dc2626)" />
                <StatCard title="Active Offers!" value="414" icon="fas fa-dollar-sign" color="linear-gradient(to right, #f97316, #ea580c)" />
                <StatCard title="Completed Tasks!" value="12" icon="fas fa-check-circle" color="linear-gradient(to right, #22c55e, #16a34a)" />
                <StatCard title="Total Offer Walls!" value="6" icon="fas fa-shopping-cart" color="linear-gradient(to right, #8b5cf6, #7c3aed)" />
                <StatCard title="Total Blog Posts!" value="15" icon="fas fa-newspaper" color="linear-gradient(to right, #14b8a6, #0d9488)" />
                <StatCard title="Total Paid Out!" value="$0" icon="fas fa-receipt" color="linear-gradient(to right, #3b82f6, #2563eb)" />
            </div>

            {/* Circle Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CircleStat title="New Users (Last 30 Days)" value="0" percentage={0} color="text-yellow-500" />
                <CircleStat title="Total Users (All Time)" value="142" percentage={100} color="text-cyan-500" />
                <CircleStat title="Tasks Completed (Last 30 days)" value="0" percentage={0} color="text-indigo-500" />
                <CircleStat title="Tasks Completed (All Time)" value="12" percentage={100} color="text-green-500" />
            </div>

            {/* Withdrawal Requests Table */}
            <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Withdrawal Requests</h3>
                <div className="overflow-x-auto">
                    {isLoading ? <p>Loading requests...</p> : error ? <p className="text-red-500">{error}</p> :
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="p-2">Transaction ID</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Method</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {withdrawalRequests.map(tx => (
                                <tr key={tx.id} className="border-t border-slate-200">
                                    <td className="p-2 font-medium">{tx.id}</td>
                                    <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="p-2">{tx.method}</td>
                                    <td className="p-2 font-bold">${tx.amount.toFixed(2)}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            tx.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        {tx.status === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApprove(tx.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">Approve</button>
                                                <button onClick={() => handleReject(tx.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">Reject</button>
                                            </div>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                </div>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Recent Task Completions</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="p-2">Transaction Number</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">User</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {recentTaskCompletions.map(task => (
                                    <tr key={task.transaction} className="border-t border-slate-200">
                                        <td className="p-2 font-medium">{task.transaction}</td>
                                        <td className="p-2">{task.date}</td>
                                        <td className="p-2">{task.user}</td>
                                        <td className="p-2 font-bold">{task.amount}</td>
                                        <td className="p-2">
                                            <button className="bg-slate-800 text-white px-3 py-1 rounded text-xs hover:bg-slate-700">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Recent Signups</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="p-2">Customer Email</th>
                                    <th className="p-2">Joined</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {recentSignups.map(user => (
                                     <tr key={user.email} className="border-t border-slate-200">
                                        <td className="p-2 font-medium">{user.email}</td>
                                        <td className="p-2">{user.joined}</td>
                                        <td className="p-2">
                                            <button className="bg-slate-800 text-white px-3 py-1 rounded text-xs hover:bg-slate-700">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;