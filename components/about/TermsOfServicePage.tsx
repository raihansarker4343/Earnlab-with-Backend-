import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Service</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Please read these terms carefully before using our services.
                </p>
                <div className="text-xs font-mono text-slate-400">Last updated: January 01, 2024</div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative z-10 space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
                    
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">1. Acceptance of Terms</h2>
                        <p>By accessing and using Earnello.com, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">2. Eligibility</h2>
                        <p>You must be at least 13 years of age to use this Service. By participating, you represent and warrant that you have the right, authority, and capacity to enter into this Agreement and to abide by all of the terms and conditions of this Agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">3. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">4. Prohibited Activities</h2>
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                            <div className="flex gap-3">
                                <i className="fas fa-exclamation-triangle text-red-500 mt-1"></i>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white mb-1">Strict Prohibition</p>
                                    <p className="text-sm">Using VPNs, proxies, or emulators to complete offers is strictly prohibited and will result in immediate account termination. Creating multiple accounts is also prohibited.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;