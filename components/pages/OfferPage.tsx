import React, { useState, useEffect, useContext } from 'react';
import OfferWallCard from '../OfferWallCard';
import type { OfferWall, Transaction } from '../../types';
import { API_URL } from '../../constants';
import SkeletonLoader from '../SkeletonLoader';
import { AppContext } from '../../App';

const SectionHeader: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const OfferPage: React.FC = () => {
    const { user, setUser, setBalance, setTransactions } = useContext(AppContext);
    const [offerWalls, setOfferWalls] = useState<OfferWall[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOfferWalls = async () => {
            try {
                const response = await fetch(`${API_URL}/api/offer-walls`);
                if (!response.ok) {
                    throw new Error('Failed to fetch offer walls.');
                }
                const data: OfferWall[] = await response.json();
                setOfferWalls(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOfferWalls();
    }, []);

    const handleCompleteOfferWall = (wall: OfferWall) => {
        if (!user) return;

        const reward = parseFloat((Math.random() * (5.00 - 0.50) + 0.50).toFixed(2));
        setBalance(prevBalance => prevBalance + reward);

        const updatedUser = {
            ...user,
            balance: (user.balance || 0) + reward,
            totalEarned: (user.totalEarned || 0) + reward,
            completedTasks: (user.completedTasks || 0) + 1,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        const newTransaction: Transaction = {
            id: `offer-${Date.now()}`,
            type: 'Task Reward',
            method: wall.name,
            amount: reward,
            status: 'Completed',
            date: new Date().toISOString(),
            source: 'Offer',
            userId: Number(user.id),
            email: user.email,
        };
        setTransactions(prev => [newTransaction, ...prev]);
        alert(`You earned $${reward.toFixed(2)} from ${wall.name}! This is a simulation as the offer wall is not integrated yet.`);
    };

    return (
        <div className="space-y-8">
            <section>
                <SectionHeader title="Offer Walls" description="Each offer wall contains hundreds of offers to complete" />
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(12)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                         {offerWalls.map((wall) => (
                            <OfferWallCard key={wall.id} wall={wall} onClick={handleCompleteOfferWall} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OfferPage;
