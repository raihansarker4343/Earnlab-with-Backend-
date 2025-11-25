import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1e293b] p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms of Service</h1>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Last updated: January 01, 2024</p>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
                    <p>By accessing and using EarnLab, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">2. Eligibility</h2>
                    <p>You must be at least 13 years of age to use this Service. By participating, you represent and warrant that you have the right, authority, and capacity to enter into this Agreement and to abide by all of the terms and conditions of this Agreement.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">3. User Accounts</h2>
                    <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">4. Prohibited Activities</h2>
                    <p>Using VPNs, proxies, or emulators to complete offers is strictly prohibited and will result in immediate account termination. Creating multiple accounts is also prohibited.</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfServicePage;