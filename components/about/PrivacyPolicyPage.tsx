import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1e293b] p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Your privacy is important to us. It is EarnLab's policy to respect your privacy regarding any information we may collect from you across our website.</p>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Information We Collect</h2>
                    <p>We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How We Use Information</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Provide, maintain and improve our services.</li>
                        <li>Process transactions and send you related information.</li>
                        <li>Send you technical notices, updates, security alerts and support messages.</li>
                        <li>Respond to your comments, questions and requests.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Security</h2>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;