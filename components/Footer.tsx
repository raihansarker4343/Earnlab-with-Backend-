import React, { useContext } from 'react';
import { AppContext } from '../App';

const Footer: React.FC = () => {
    const { setCurrentPage } = useContext(AppContext);

    const handleNavClick = (e: React.MouseEvent, pageName: string) => {
        e.preventDefault();
        setCurrentPage(pageName);
    };

    return (
        <footer className="bg-white dark:bg-[#141c2f] border-t border-slate-200 dark:border-slate-700 py-12 text-slate-600 dark:text-slate-400">
            <div className="container mx-auto px-8">
                <div className="flex flex-wrap justify-between items-start gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">EarnLab</h3>
                         <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-2 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <span className="font-serif text-lg">A</span>
                                <span>English</span>
                            </button>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between text-sm w-full max-w-xs">
                            <span className="text-slate-700 dark:text-slate-300">Average</span>
                            <div className="flex items-center ml-2">
                                {[...Array(4)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
                                <i className="fas fa-star text-slate-300 dark:text-slate-600"></i>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Menu</h4>
                            <ul className="space-y-2">
                                <li><a href="/Home" onClick={(e) => handleNavClick(e, 'Home')} className="hover:text-slate-900 dark:hover:text-white">Home</a></li>
                                <li><a href="/Offer" onClick={(e) => handleNavClick(e, 'Offer')} className="hover:text-slate-900 dark:hover:text-white">Offer</a></li>
                                <li><a href="/Tasks" onClick={(e) => handleNavClick(e, 'Tasks')} className="hover:text-slate-900 dark:hover:text-white">Tasks</a></li>
                                <li><a href="/Surveys" onClick={(e) => handleNavClick(e, 'Surveys')} className="hover:text-slate-900 dark:hover:text-white">Surveys</a></li>
                                <li><a href="/Referrals" onClick={(e) => handleNavClick(e, 'Referrals')} className="hover:text-slate-900 dark:hover:text-white">Affiliates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Games</h4>
                            <ul className="space-y-2">
                                <li><a href="/Boxes" onClick={(e) => handleNavClick(e, 'Boxes')} className="hover:text-slate-900 dark:hover:text-white">Boxes</a></li>
                                <li><a href="/Battles" onClick={(e) => handleNavClick(e, 'Battles')} className="hover:text-slate-900 dark:hover:text-white">Battles</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">About</h4>
                            <ul className="space-y-2">
                                <li><a href="/Blog" onClick={(e) => handleNavClick(e, 'Blog')} className="hover:text-slate-900 dark:hover:text-white">Blog</a></li>
                                <li><a href="/Guides" onClick={(e) => handleNavClick(e, 'Guides')} className="hover:text-slate-900 dark:hover:text-white">Guides</a></li>
                                <li><a href="/TermsofService" onClick={(e) => handleNavClick(e, 'Terms of Service')} className="hover:text-slate-900 dark:hover:text-white">Terms of Service</a></li>
                                <li><a href="/PrivacyPolicy" onClick={(e) => handleNavClick(e, 'Privacy Policy')} className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</a></li>
                                <li><a href="/CookiePolicy" onClick={(e) => handleNavClick(e, 'Cookie Policy')} className="hover:text-slate-900 dark:hover:text-white">Cookie Policy</a></li>
                                <li><a href="/AMLKYCPolicy" onClick={(e) => handleNavClick(e, 'AML & KYC Policy')} className="hover:text-slate-900 dark:hover:text-white">AML & KYC Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Help</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Frequently Asked</a></li>
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Help Desk</a></li>
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Support</a></li>
                                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Fairness</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center text-slate-500 dark:text-slate-400 text-sm">
                    <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} EarnLab &bull; All rights reserved. &bull; <a href="/#/admin" className="hover:underline"></a></p>
                    <div className="flex space-x-4 text-lg">
                        <a href="#" aria-label="Discord" className="hover:text-slate-900 dark:hover:text-white"><i className="fab fa-discord"></i></a>
                        <a href="#" aria-label="Twitter" className="hover:text-slate-900 dark:hover:text-white"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="TikTok" className="hover:text-slate-900 dark:hover:text-white"><i className="fab fa-tiktok"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;