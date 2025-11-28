import React from 'react';

const CookiePolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1e293b] p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Cookie Policy</h1>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>This Cookie Policy explains how Earnello.com uses cookies and similar technologies to recognize you when you visit our website.</p>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What are cookies?</h2>
                    <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Why do we use cookies?</h2>
                    <p>We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Tracking and Offer Completion</h2>
                    <p>Third parties (offer walls) serve cookies through our Website for advertising, analytics and other purposes. This is essential for tracking your offer completion status so we can reward you.</p>
                </section>
            </div>
        </div>
    );
};

export default CookiePolicyPage;