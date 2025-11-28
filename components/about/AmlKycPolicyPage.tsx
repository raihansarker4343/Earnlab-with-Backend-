import React from 'react';

const AmlKycPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    AML & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">KYC Policy</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Our commitment to security, transparency, and compliance.
                </p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative z-10 space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                        Earnello.com is committed to the highest standards of Anti-Money Laundering (AML) and Know Your Customer (KYC) compliance.
                    </p>

                    <section>
                        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm">1</span>
                            Policy Statement
                        </h2>
                        <div className="pl-11">
                            <p>It is our policy to prohibit and actively prevent money laundering and any activity that facilitates money laundering or the funding of terrorist or criminal activities. We strive to comply with all applicable requirements under the legislation in force in the jurisdictions in which we operate.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm">2</span>
                            Customer Identification Procedures
                        </h2>
                        <div className="pl-11">
                            <p>We may require users to verify their identity to ensure the safety of our platform. This process may occur upon reaching a withdrawal threshold or if suspicious activity is detected.</p>
                            <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="font-semibold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wider">Required documents may include:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm">
                                        <i className="fas fa-check text-emerald-500 mt-1"></i>
                                        <span>Government-issued photo ID (Passport, Driver's License, or ID Card)</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm">
                                        <i className="fas fa-check text-emerald-500 mt-1"></i>
                                        <span>Proof of address (Utility bill or Bank statement)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm">3</span>
                            Monitoring and Reporting
                        </h2>
                        <div className="pl-11">
                            <p>We monitor user activity for unusual or suspicious patterns. We reserve the right to suspend accounts and report suspicious activities to the relevant authorities without prior notice.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AmlKycPolicyPage;