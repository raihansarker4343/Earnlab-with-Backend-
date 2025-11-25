import React from 'react';

const GuidesPage: React.FC = () => {
    const guides = [
        {
            title: "Getting Started",
            icon: "fas fa-rocket",
            description: "Learn the basics of setting up your account and completing your first task."
        },
        {
            title: "Survey Success",
            icon: "fas fa-poll-h",
            description: "Tips and tricks to qualify for more surveys and avoid screen-outs."
        },
        {
            title: "Offer Wall Mastery",
            icon: "fas fa-th-large",
            description: "How to efficiently complete game offers and app downloads for maximum XP."
        },
        {
            title: "Referral Program",
            icon: "fas fa-users",
            description: "Maximize your passive income by inviting friends and building your network."
        }
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Guides & Tutorials</h1>
                <p className="text-slate-500 dark:text-slate-400">Everything you need to know to become a top earner.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {guides.map((guide, idx) => (
                    <div key={idx} className="flex gap-4 bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-xl">
                            <i className={guide.icon}></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{guide.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{guide.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuidesPage;