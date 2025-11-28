import React from 'react';

const CookiePolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Policy</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Understanding how we use cookies to improve your experience.
                </p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative z-10 space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                        This Cookie Policy explains how Earnello.com uses cookies and similar technologies to recognize you when you visit our website.
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">What are cookies?</h2>
                        <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Why do we use cookies?</h2>
                        <p>We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Tracking and Offer Completion</h2>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800/50">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <i className="fas fa-cookie-bite"></i>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white mb-1">Essential for Rewards</p>
                                    <p className="text-sm">Third parties (offer walls) serve cookies through our Website for advertising, analytics and other purposes. This is essential for tracking your offer completion status so we can reward you.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicyPage;