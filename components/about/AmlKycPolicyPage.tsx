import React from 'react';

const AmlKycPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1e293b] p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">AML & KYC Policy</h1>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Earnello.com is committed to the highest standards of Anti-Money Laundering (AML) and Know Your Customer (KYC) compliance.</p>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">1. Policy Statement</h2>
                    <p>It is our policy to prohibit and actively prevent money laundering and any activity that facilitates money laundering or the funding of terrorist or criminal activities. We strive to comply with all applicable requirements under the legislation in force in the jurisdictions in which we operate.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">2. Customer Identification Procedures</h2>
                    <p>We may require users to verify their identity to ensure the safety of our platform. This process may occur upon reaching a withdrawal threshold or if suspicious activity is detected.</p>
                    <p className="mt-2">Required documents may include:</p>
                    <ul className="list-disc list-inside mt-1 pl-4">
                        <li>Government-issued photo ID (Passport, Driver's License, or ID Card)</li>
                        <li>Proof of address (Utility bill or Bank statement)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">3. Monitoring and Reporting</h2>
                    <p>We monitor user activity for unusual or suspicious patterns. We reserve the right to suspend accounts and report suspicious activities to the relevant authorities without prior notice.</p>
                </section>
            </div>
        </div>
    );
};

export default AmlKycPolicyPage;