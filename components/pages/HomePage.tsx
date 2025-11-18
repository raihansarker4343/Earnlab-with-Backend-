import React, { useState, useEffect, useRef, useContext } from 'react';
// FIX: Corrected the import path for AppContext. It is defined in '../../types', not '../../App'.
import { AppContext } from '../../types';
import { FAQ_ITEMS, REWARD_OPTIONS, TESTIMONIALS, FEATURED_OFFERS } from '../../constants';
import type { FaqItem } from '../../types';

// Custom hook to detect when an element is in view
const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return [ref, isInView] as const;
};

// Component to animate counting up to a target number
const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
    const target = parseInt(value.replace(/[^0-9]/g, ''), 10);
    const [count, setCount] = useState(0);
    const [ref, isInView] = useInView({ threshold: 0.5 });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = target;
            if (start === end) return;

            const duration = 2000; // ms
            const frameDuration = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameDuration);
            const increment = (end - start) / totalFrames;
            
            let currentFrame = 0;
            const timer = setInterval(() => {
                currentFrame++;
                start += increment;
                if (currentFrame === totalFrames) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, frameDuration);
            
            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    const formattedCount = count.toLocaleString();
    const prefix = value.startsWith('$') ? '$' : '';

    return <div ref={ref as React.RefObject<HTMLDivElement>}>{`${prefix}${formattedCount}`}</div>;
};

// Accordion item for the FAQ section with smooth transitions
const FaqAccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left flex justify-between items-center p-6 hover:bg-slate-100/50 dark:hover:bg-slate-700/20 focus:outline-none">
                <span className="font-semibold text-lg text-slate-900 dark:text-white">{item.question}</span>
                <span className={`transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
                    <i className="fas fa-chevron-down"></i>
                </span>
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
                className="overflow-hidden transition-all duration-500 ease-in-out"
            >
                <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400">{item.answer}</div>
            </div>
        </div>
    );
};

const HighestPayoutsIcon = () => (
  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
    <svg className="w-8 h-8 text-green-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 28H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 28V22H22V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22V16H20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8L16 4L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const InstantCashoutsIcon = () => (
  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
    <svg className="w-8 h-8 text-green-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10H24C26.2091 10 28 11.7909 28 14V22C28 24.2091 26.2091 26 24 26H8C5.79086 26 4 24.2091 4 22V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="18" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 6L28 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 12H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const DailyBonusesIcon = () => (
  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
    <svg className="w-8 h-8 text-green-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 14H28V28H4V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 28V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 14H4C4 9 8 4 16 4C24 4 28 9 28 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const earningMethods = [
  {
    title: 'Play games',
    description: 'In order to attract more players, gaming companies want to pay you to play their games, let\'s play!',
    earnLabel: 'Earn per game',
    earnAmount: '$1.00 - $120.00',
    images: ['https://i.imgur.com/YB9NpXZ.png'],
  },
  {
    title: 'Complete offers',
    description: 'Get to know new companies by trying their apps while you earn money. It\'s time to get paid for using apps!',
    earnLabel: 'Earn per app',
    earnAmount: '$1.00 - $75.00',
    images: ['https://i.imgur.com/g2bn5eQ.png'],
  },
  {
    title: 'Join surveys',
    description: 'Companies need your opinion to create better products and services. That\'s why they pay for your feedback.',
    earnLabel: 'Earn per 5-10 min survey',
    earnAmount: '$1.00',
    images: ['https://i.imgur.com/tcAqi0j.png'],
  },
];

const siteBenefits = [
   {
    icon: <HighestPayoutsIcon />,
    title: 'Highest payouts',
    description: 'Earn way more than on other sites. It\'s our goal to help you make as much money as possible.',
  },
  {
    icon: <InstantCashoutsIcon />,
    title: 'Instant cashouts',
    description: 'Ready to get your money? The minimum cashout varies by region, between as little as $5 and $20, and payouts are almost instant.',
  },
  {
    icon: <DailyBonusesIcon />,
    title: 'Daily bonuses',
    description: 'Climb the daily bonus ladder, reach the leaderboard, or start a streak to earn extra rewards, for free.',
  },
];

const HomePageContent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { openSignupModal } = useContext(AppContext);
  const [email, setEmail] = useState('');

  const handleStartEarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
        openSignupModal(email);
    } else {
        alert('Please enter a valid email address.');
    }
  };

  useEffect(() => {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
  }, []);

  const [bestWaysRef, isBestWaysInView] = useInView({ threshold: 0.1 });
  const [whyUsRef, isWhyUsInView] = useInView({ threshold: 0.1 });
  const [rewardsRef, isRewardsInView] = useInView({ threshold: 0.15 });
  const [testimonialsRef, isTestimonialsInView] = useInView({ threshold: 0.15 });
  const [statsRef, isStatsInView] = useInView({ threshold: 0.15 });
  const [faqRef, isFaqInView] = useInView({ threshold: 0.15 });
  
  return (
    <div className="bg-white dark:bg-[#0b111e] text-slate-700 dark:text-slate-300 overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-[#1e2232] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: "url('https://i.imgur.com/7GVjh0M.png')"}}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e2232] via-[#1e2232]/80 to-transparent"></div>
            
            <div className="container mx-auto px-4 py-20 lg:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className={`transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                            <span className="text-[#34d399]">Get paid</span> for testing apps, games & surveys
                        </h1>
                        <p className="text-slate-300 mb-8 flex flex-wrap items-center gap-x-3 text-sm sm:text-base">
                            <span>Earn up to <span className="font-bold text-white">$200</span> per offer</span>
                            <span className="text-[#34d399] text-xl">&bull;</span>
                            <span><span className="font-bold text-white">1624</span> Offers available now</span>
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {FEATURED_OFFERS.map(offer => (
                                <div key={offer.name} className="bg-[#2a2f44]/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700 text-left">
                                    <div className="bg-black/20 rounded-md mb-3 flex items-center justify-center aspect-square overflow-hidden">
                                        <img src={offer.logo} alt={offer.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-semibold text-white truncate text-sm">{offer.name}</h3>
                                    <p className="text-slate-400 text-xs truncate mb-2">{offer.description}</p>
                                    <div className="flex justify-between items-center">
                                      <p className="font-bold text-white text-sm">${offer.payout.toFixed(2)}</p>
                                      <p className="text-yellow-400 text-xs flex items-center gap-1">
                                          <i className="fas fa-star text-xs"></i> {offer.rating.toFixed(1)}
                                      </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <p className="text-sm text-slate-400 mb-2">See our reviews on</p>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-star text-green-500"></i>
                                <span className="text-xl font-bold text-white">Trustpilot</span>
                                <div className="flex items-center ml-2 bg-green-500 p-1" style={{clipPath: 'polygon(0 0, 100% 0, 100% 70%, 95% 100%, 5% 100%, 0 70%)'}}>
                                    {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-white text-sm px-1"></i>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`bg-[#2a2f44] p-8 rounded-2xl shadow-lg border border-slate-700 transition-all duration-1000 ease-out delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up for Free</h2>
                        <form onSubmit={handleStartEarning}>
                            <div className="relative mb-4">
                                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input 
                                    type="email" 
                                    placeholder="Email address" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1e2232] text-white p-3 pl-12 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400" 
                                />
                            </div>
                            <a href="#" className="text-sm text-slate-400 hover:underline mb-4 block text-center">I have a referral code</a>
                            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg mb-4 text-lg transition-colors">Start earning now</button>
                        </form>
                        
                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-slate-600" />
                            <span className="mx-4 text-slate-400 text-sm font-semibold">OR</span>
                            <hr className="flex-grow border-slate-600" />
                        </div>
                        
                        <div className="space-y-3">
                            <button onClick={() => openSignupModal()} className="w-full bg-white text-slate-800 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" /> Sign Up with Google
                            </button>
                            <button onClick={() => openSignupModal()} className="w-full bg-[#1877F2] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors">
                                <i className="fab fa-facebook-f text-lg"></i> Sign Up with Facebook
                            </button>
                            <button onClick={() => openSignupModal()} className="w-full bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors">
                                <i className="fab fa-apple text-xl"></i> Sign Up with Apple
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-400 mt-6">
                            <span className="font-bold text-white">100+</span> sign ups in the past 24 hours
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Best ways to earn Section */}
        <section ref={bestWaysRef} className="py-20 text-center bg-white dark:bg-[#0b111e]">
            <h2 className={`text-4xl font-bold text-slate-900 dark:text-white mb-12 transition-opacity duration-700 ${isBestWaysInView ? 'opacity-100' : 'opacity-0'}`}>Best ways to earn</h2>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                {earningMethods.map((method, i) => (
                    <div key={i} className={`bg-slate-50 dark:bg-[#141c2f] p-8 rounded-lg text-left flex flex-col transition-all duration-500 ease-out hover:-translate-y-2 ${isBestWaysInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{method.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{method.description}</p>
                        <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{method.earnLabel}</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{method.earnAmount}</p>
                        </div>
                        <div className="mt-auto pt-6">
                            <img src={method.images[0]} alt={method.title} className="rounded-lg w-full h-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Why Us Section */}
        <section ref={whyUsRef} className="py-20 text-center bg-white dark:bg-[#0b111e]">
            <h2 className={`text-4xl font-bold text-slate-900 dark:text-white mb-12 transition-opacity duration-700 ${isWhyUsInView ? 'opacity-100' : 'opacity-0'}`}>
                We're the #1 site to make money. <span className="text-green-400">Here's why</span>
            </h2>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                {siteBenefits.map((benefit, i) => (
                    <div key={i} className={`bg-slate-50 dark:bg-[#141c2f] p-8 rounded-lg text-left transition-all duration-500 ease-out hover:-translate-y-2 ${isWhyUsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                        {benefit.icon}
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-2">{benefit.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Rewards Section */}
        <section ref={rewardsRef} className="py-20 bg-slate-50 dark:bg-[#141c2f] text-center">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Reward, Your Way</h2>
            <p className="max-w-3xl mx-auto mb-12 text-slate-600 dark:text-slate-400">From PayPal and gift cards to crypto, EarnLab offers a wide range of withdrawal options. Select the method that works best for you and enjoy your earnings with ease.</p>
            <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-8">
                {REWARD_OPTIONS.map((option, i) => (
                    <div key={option.name} className={`flex items-center justify-center p-6 rounded-lg ${option.bgColor} transition-all duration-300 ease-out hover:scale-105 ${isRewardsInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: `${i * 50}ms` }}>
                        <i className={`${option.logo} text-4xl`}></i>
                    </div>
                ))}
            </div>
        </section>
        
        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-20 bg-slate-50 dark:bg-[#141c2f]">
            <div className="container mx-auto px-8 text-center">
                <span className="text-sm font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">Customer Reviews</span>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-4 mb-12">Everybody loves EarnLab</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {TESTIMONIALS.map((testimonial, i) => (
                        <div 
                            key={i} 
                            className={`bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 relative flex flex-col transition-all duration-500 ease-out hover:-translate-y-2 ${isTestimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <i className="fas fa-quote-left text-6xl text-teal-400 opacity-20 absolute top-6 left-6"></i>
                            <div className="relative z-10 flex flex-col flex-grow">
                                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{testimonial.text}</p>
                                <div className="mt-auto">
                                    <p className="font-bold text-slate-800 dark:text-white">{testimonial.author}</p>
                                    <div className="flex items-center mt-2">
                                        {[...Array(testimonial.rating)].map((_, starIndex) => (
                                            <i key={starIndex} className="fas fa-star text-yellow-400"></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Stats Section */}
        {/* <section ref={statsRef} className="py-20 bg-white dark:bg-[#0f172a] text-center">
             <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Join The EarnLab Success Story</h2>
             <p className="max-w-3xl mx-auto mb-12 text-slate-600 dark:text-slate-400">Be part of our growing community and start earning effortlessly. See how thousands are turning simple tasks into real money.</p>
             <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                <div className={`text-center transition-opacity duration-700 ${isStatsInView ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-5xl font-bold text-blue-500 dark:text-blue-400"><AnimatedCounter value="415,942" /></div>
                    <div className="text-slate-600 dark:text-slate-400 mt-2">Total Users</div>
                </div>
                 <div className={`text-center transition-opacity duration-700 delay-200 ${isStatsInView ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-5xl font-bold text-blue-500 dark:text-blue-400"><AnimatedCounter value="1,438,691" /></div>
                    <div className="text-slate-600 dark:text-slate-400 mt-2">Tasks Completed</div>
                </div>
                 <div className={`text-center transition-opacity duration-700 delay-300 ${isStatsInView ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-5xl font-bold text-blue-500 dark:text-blue-400"><AnimatedCounter value="$3,741,246" /></div>
                    <div className="text-slate-600 dark:text-slate-400 mt-2">Total Earned</div>
                </div>
             </div>
             <button onClick={() => openSignupModal()} className="mt-12 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">Join Us</button>
        </section> */}

        {/* FAQ Section */}
        <section ref={faqRef} className={`py-20 bg-slate-50 dark:bg-[#141c2f] transition-opacity duration-1000 ${isFaqInView ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto px-8 max-w-4xl">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">Your EarnLab Questions Answered</h2>
                <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
                    {FAQ_ITEMS.map((item, i) => <FaqAccordionItem key={i} item={item} />)}
                </div>
            </div>
        </section>
    </div>
  );
};

export default HomePageContent;