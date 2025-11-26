import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import SkeletonLoader from '../SkeletonLoader';
import SurveyProviderCard from '../SurveyProviderCard';
import OfferWallCard from '../OfferWallCard';
import type { SurveyProvider, OfferWall } from '../../types';
import { API_URL } from '../../constants';
import { AppContext } from '../../App';

const featuredTasks = [
  { image: 'https://i.imgur.com/r6355M8.png', title: 'Hero Castle War: T...', description: 'Open the app, registe...', payout: 2.50 },
  { image: 'https://shorturl.at/WFqAo', title: 'Wild Fish - Android...', description: 'Be the best fisherman...', payout: 1.75 },
  { image: 'https://i.imgur.com/wI4aB9a.png', title: 'CortalyCash', description: 'Complete all steps list...', payout: 5.00 },
  { image: 'https://i.imgur.com/Y8H4yT6.png', title: 'WW Click Box - Mu...', description: 'Answer the survey qu...', payout: 0.80 },
  { image: 'https://i.imgur.com/lO7qD52.png', title: 'Treehouse Fishing ...', description: 'Climb into your treeho...', payout: 3.20 },
  { image: 'https://i.imgur.com/wZ68tB3.png', title: 'Money Quiz', description: 'Register using full vali...', payout: 1.10 },
];

const featuredSurveys = [
  { title: 'Qualification', duration: '1 minute', payout: 0.25 },
  { title: 'Daily Poll', duration: '30 seconds', payout: 0.10 },
  { title: 'Shopping Habits', duration: '5 minutes', payout: 1.50 },
  { title: 'Tech Gadgets Opinion', duration: '10 minutes', payout: 2.00 },
  { title: 'Travel Preferences', duration: '8 minutes', payout: 1.75 },
  { title: 'YourNext TV Show', duration: '3 minutes', payout: 0.75 },
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
    const { user } = useContext(AppContext);
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(true);
    const [errorRecs, setErrorRecs] = useState<string | null>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    const [offerWalls, setOfferWalls] = useState<OfferWall[]>([]);
    const [surveyProviders, setSurveyProviders] = useState<SurveyProvider[]>([]);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [errorContent, setErrorContent] = useState<string | null>(null);

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const [offersRes, surveysRes] = await Promise.all([
                    fetch(`${API_URL}/api/offer-walls`),
                    fetch(`${API_URL}/api/survey-providers`)
                ]);

                if (!offersRes.ok) throw new Error('Failed to load offer walls.');
                if (!surveysRes.ok) throw new Error('Failed to load survey providers.');
                
                const offersData = await offersRes.json();
                const surveysData = await surveysRes.json();

                setOfferWalls(offersData);
                setSurveyProviders(surveysData);

            } catch (err: any) {
                setErrorContent(err.message);
            } finally {
                setIsLoadingContent(false);
            }
        };

        fetchPageContent();
    }, []);

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
                <img src="https://res.cloudinary.com/dsezfqke7/image/upload/v1764164444/CbsLDah3fAlDDqaOTg-UuXejkqhkdZ54Z8zjEh3N6xJVAowU12wrrgQFvXWio8p_i4QAVXPHbbG6r1i8lQ5x_w416-h235-rw_aoc2pk.webp" alt="Earn Money" className="rounded-lg w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                <img src="https://res.cloudinary.com/dsezfqke7/image/upload/v1764164054/cKv9DpQx7jqFjbiC5YDxJUDOHDKkXZcN1kaVsVhCD078P89PNd4c7vY5owtA38xz0Nk_w416-h235-rw_hjrhhq.webp" alt="Monthly Race" className="rounded-lg w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                <img src="https://res.cloudinary.com/dsezfqke7/image/upload/v1764164295/xH0v0E_tdlO_jffww7nAE2968JTeN6LzKdz02QBFI2RqBoQjEMPhEekK70jn_gzRzrqb_w416-h235-rw_hqna8z.webp" alt="Rewards" className="rounded-lg w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" />
            </div>

            {/* Recommended for you */}
           {/* <section>
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
            </section> */}

            {/* Featured Tasks */}
            <section>
                <SectionHeader title="Featured Tasks" description="Featured tasks are the best tasks to complete, with the highest rewards" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {featuredTasks.map((task, index) => (
                        <div key={index} className="bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden group hover:-translate-y-1 transition-transform border border-slate-200 dark:border-slate-800 flex flex-col">
                            <div className="relative">
                                <img src={task.image} alt={task.title} className="w-full aspect-[4/3] object-cover" />
                            </div>
                            <div className="p-3 flex-grow flex flex-col">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-500 dark:group-hover:text-blue-400">{task.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex-grow">{task.description}</p>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <p className="font-bold text-green-500 dark:text-green-400">${task.payout.toFixed(2)}</p>
                                    <button 
                                        className="bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Complete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Surveys */}
            <section>
                <SectionHeader title="Featured Surveys" description="Explore our handpicked selection of surveys just for you" />
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
                    {featuredSurveys.map((survey, index) => (
                         <div key={index} className="bg-white dark:bg-[#1e293b] rounded-lg p-4 flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform border border-slate-200 dark:border-slate-800">
                             <div className="w-full aspect-square bg-slate-100 dark:bg-[#132841] rounded-lg flex items-center justify-center mb-3">
                                 <i className="fas fa-clipboard-list text-4xl text-blue-500 dark:text-blue-400"></i>
                             </div>
                            <div className="flex-grow">
                                 <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">{survey.title}</h3>
                                 <p className="text-sm text-slate-500 dark:text-slate-400">{survey.duration}</p>
                            </div>
                             <div className="flex justify-between items-center mt-2 pt-2 w-full border-t border-slate-200 dark:border-slate-800">
                                <p className="font-bold text-green-500 dark:text-green-400">${survey.payout.toFixed(2)}</p>
                                <button 
                                    className="bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Complete
                                </button>
                            </div>
                         </div>
                    ))}
                </div>
            </section>
            
            {/* Offer Walls */}
            <section>
                <SectionHeader title="Offer Walls" description="Each offer wall contains hundreds of offers to complete" />
                 {isLoadingContent ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
                    </div>
                ) : errorContent ? (
                    <div className="text-center py-12 text-red-500">{errorContent}</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                         {offerWalls.map((wall) => (
                            <OfferWallCard key={wall.id} wall={wall} />
                        ))}
                    </div>
                )}
            </section>

             {/* Survey Walls */}
            <section>
                <SectionHeader title="Survey Walls" description="Each survey wall contains hundreds of surveys to complete" />
                 {isLoadingContent ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
                    </div>
                ) : errorContent ? (
                    <div className="text-center py-12 text-red-500">{errorContent}</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                         {surveyProviders.map((wall) => (
                             <SurveyProviderCard key={wall.id} provider={wall} />
                         ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default LoggedInHomePage;
