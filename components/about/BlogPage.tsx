import React from 'react';

const BlogPage: React.FC = () => {
    const posts = [
        {
            id: 1,
            title: "Top 5 Ways to Maximize Your Earnings",
            excerpt: "Discover the strategies top earners use to get the most out of surveys and offers.",
            date: "Oct 12, 2023",
            image: "https://i.imgur.com/kP4dmA8.png"
        },
        {
            id: 2,
            title: "Understanding Crypto Withdrawals",
            excerpt: "A comprehensive guide on how to withdraw your earnings using cryptocurrency safely.",
            date: "Nov 05, 2023",
            image: "https://i.imgur.com/uN83F9y.png"
        },
        {
            id: 3,
            title: "New Offer Walls Added!",
            excerpt: "We have integrated three new high-paying offer walls. Check out what's new.",
            date: "Dec 01, 2023",
            image: "https://i.imgur.com/s6n5s7H.png"
        }
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">EarnLab Blog</h1>
                <p className="text-slate-500 dark:text-slate-400">Latest news, updates, and tips from the EarnLab team.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">{post.date}</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-3">{post.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{post.excerpt}</p>
                            <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">Read More &rarr;</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;