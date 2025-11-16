import React, { useState, useEffect } from 'react';
import OfferWallCard from '../OfferWallCard';
import type { OfferWall } from '../../types';
import { API_URL } from '../../constants';
import SkeletonLoader from '../SkeletonLoader';

const SectionHeader: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const OfferPage: React.FC = () => {
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

    return (
        <div className="space-y-8">
            <section>
                <SectionHeader title="Offer Walls" description="Each offer wall contains hundreds of offers to complete" />
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                         {offerWalls.map((wall) => (
                            <OfferWallCard key={wall.id} wall={wall} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OfferPage;
