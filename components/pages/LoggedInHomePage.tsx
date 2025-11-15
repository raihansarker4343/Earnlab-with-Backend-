import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import SkeletonLoader from '../SkeletonLoader';
import { SURVEY_PROVIDERS, OFFER_WALLS } from '../../constants';
import SurveyProviderCard from '../SurveyProviderCard';
import OfferWallCard from '../OfferWallCard';
import { StarIcon } from '../icons/SurveyIcons';

// Mock data for the new sections
const featuredTasks = [
  { image: 'https://i.imgur.com/r6355M8.png', title: 'Hero Castle War: T...', description: 'Open the app, registe...' },
  { image: 'https://i.imgur.com/2Y44g63.png', title: 'Wild Fish - Android...', description: 'Be the best fisherman...' },
  { image: 'https://i.imgur.com/wI4aB9a.png', title: 'CortalyCash', description: 'Complete all steps list...' },
  { image: 'https://i.imgur.com/Y8H4yT6.png', title: 'WW Click Box - Mu...', description: 'Answer the survey qu...' },
  { image: 'https://i.imgur.com/lO7qD52.png', title: 'Treehouse Fishing ...', description: 'Climb into your treeho...' },
  { image: 'https://i.imgur.com/wZ68tB3.png', title: 'Money Quiz', description: 'Register using full vali...' },
];

const featuredSurveys = [
  { title: 'Qualification', duration: '1 minute' },
];

interface AIRecommendation {
    title: string;
    description: string;
    payout: number;
    icon: string;
}

const SectionHeader: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <a href="#" className="text-blue-500 dark:text-blue-400 font-semibold hover:underline flex-shrink-0">View All</a>
    </div>
);

const LoggedInHomePage: React.FC = () => {
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(true);
    const [errorRecs, setErrorRecs] = useState<string | null>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    useEffect(() => {
        if (process.env.API_KEY) {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
            fetchRecommendations();
        } else {
            setIsLoadingRecs(false);
            setErrorRecs("API key not found.");
        }
    }, []);

    const fetchRecommendations = async () => {
        if (!aiRef.current) return;
        setIsLoadingRecs(true);
        setErrorRecs(null);
        try {
            const prompt = "Based on a user who enjoys mobile games and quick surveys, generate 3 fictional but realistic and engaging task recommendations for an earning website. Include a title, short description, a plausible payout as a number, and a relevant Font Awesome icon class name (e.g., 'fas fa-gamepad').";
            
            const response = await aiRef.current.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        payout: { type: Type.NUMBER },
                                        icon: { type: Type.STRING }
                                    },
                                    required: ["title", "description", "payout", "icon"],
                                }
                            }
                        }
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text);
            if (jsonResponse.recommendations) {
                setRecommendations(jsonResponse.recommendations);
            } else {
                throw new Error("Invalid response format from AI.");
            }
        } catch (err) {
            console.error("Error fetching AI recommendations:", err);
            setErrorRecs("Could not load recommendations.");
        } finally {
            setIsLoadingRecs(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Top Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <img src="https://i.imgur.com/kP4dmA8.png" alt="Earn Money" className="rounded-lg w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                <img src="https://i.imgur.com/s6n5s7H.png" alt="Monthly Race" className="rounded-lg w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                <img src="https://i.imgur.com/uN83F9y.png" alt="Rewards" className="rounded-lg w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" />
            </div>

            {/* Recommended for you */}
            <section>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recommended for You</h2>
                    <p className="text-slate-500 dark:text-slate-400">AI-powered suggestions based on your activity</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoadingRecs ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-4">
                                <SkeletonLoader className="w-12 h-12 rounded-lg flex-shrink-0" />
                                <div className="flex-1">
                                    <SkeletonLoader className="h-5 w-3/4 mb-2" />
                                    <SkeletonLoader className="h-4 w-full mb-3" />
                                    <SkeletonLoader className="h-6 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : errorRecs ? (
                         <div className="col-span-full text-center py-8 bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-800">
                             <p className="text-red-500">{errorRecs}</p>
                         </div>
                    ) : (
                        recommendations.map((rec, index) => (
                            <div key={index} className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-4 items-start hover:-translate-y-1 transition-transform cursor-pointer">
                                <div className="bg-blue-500/10 text-blue-500 dark:text-blue-400 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className={`${rec.icon} text-2xl`}></i>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">{rec.description}</p>
                                    <p className="font-bold text-green-500 dark:text-green-400 text-lg">${rec.payout.toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Featured Tasks */}
            <section>
                <SectionHeader title="Featured Tasks" description="Featured tasks are the best tasks to complete, with the highest rewards" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {featuredTasks.map((task, index) => (
                        <div key={index} className="bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform border border-slate-200 dark:border-slate-800">
                            <img src={task.image} alt={task.title} className="w-full aspect-[4/3] object-cover" />
                            <div className="p-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-500 dark:group-hover:text-blue-400">{task.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{task.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Surveys */}
            <section>
                <SectionHeader title="Featured Surveys" description="Explore our handpicked selection of surveys just for you" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                    {featuredSurveys.map((survey, index) => (
                         <div key={index} className="bg-white dark:bg-[#1e293b] rounded-lg p-4 flex flex-col items-start group cursor-pointer hover:-translate-y-1 transition-transform border border-slate-200 dark:border-slate-800">
                             <div className="w-full aspect-square bg-slate-100 dark:bg-[#132841] rounded-lg flex items-center justify-center mb-3">
                                 <i className="fas fa-clipboard-list text-4xl text-blue-500 dark:text-blue-400"></i>
                             </div>
                             <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">{survey.title}</h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400">{survey.duration}</p>
                             <div className="self-end mt-auto pt-2"><StarIcon /></div>
                         </div>
                    ))}
                </div>
            </section>
            
            {/* Offer Walls */}
            <section>
                <SectionHeader title="Offer Walls" description="Each offer wall contains hundreds of offers to complete" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                     {OFFER_WALLS.map((wall) => (
                        <OfferWallCard key={wall.name} wall={wall} />
                    ))}
                </div>
            </section>

             {/* Survey Walls */}
            <section>
                <SectionHeader title="Survey Walls" description="Each survey wall contains hundreds of surveys to complete" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                     {SURVEY_PROVIDERS.map((wall) => (
                         <SurveyProviderCard key={wall.name} provider={wall} />
                     ))}
                </div>
            </section>

        </div>
    );
};

export default LoggedInHomePage;