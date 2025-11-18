import React, { useState, useEffect, useContext } from 'react';
import SurveyProviderCard from '../SurveyProviderCard';
import type { SurveyProvider } from '../../types';
import { API_URL } from '../../constants';
import SkeletonLoader from '../SkeletonLoader';
import { AppContext } from '../../types';

const SurveysPage: React.FC = () => {
    const [providers, setProviders] = useState<SurveyProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/survey-providers`);
                if (!response.ok) {
                    throw new Error('Failed to fetch survey providers.');
                }
                const data: SurveyProvider[] = await response.json();
                setProviders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProviders();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Survey Partners</h1>
                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                        <i className="fas fa-question-circle"></i>
                    </button>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">$1 = 1000 coins</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...Array(8)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {providers.map((provider) => (
                        <SurveyProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SurveysPage;