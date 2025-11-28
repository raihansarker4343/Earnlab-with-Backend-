import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Policy</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Your privacy is important to us.
                </p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative z-10 space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                        It is Earnello.com's policy to respect your privacy regarding any information we may collect from you across our website.
                    </p>

                    <section>
                        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-3">
                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                            Information We Collect
                        </h2>
                        <div className="pl-4">
                            <p>We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-3">
                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                            How We Use Information
                        </h2>
                        <div className="pl-4">
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {['Provide, maintain and improve our services.', 'Process transactions and send you related information.', 'Send you technical notices, updates, security alerts and support messages.', 'Respond to your comments, questions and requests.'].map((item, idx) => (
                                    <li key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-sm border border-slate-100 dark:border-slate-700/50 flex items-start gap-2">
                                        <i className="fas fa-check-circle text-purple-500 mt-0.5"></i>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-3">
                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                            Security
                        </h2>
                        <div className="pl-4">
                            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;