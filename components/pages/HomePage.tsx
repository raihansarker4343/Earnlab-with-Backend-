import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../../App';
import { FAQ_ITEMS, REWARD_OPTIONS, TESTIMONIALS, FEATURED_OFFERS } from '../../constants';
import { API_URL } from '../../constants';
import type { FaqItem } from '../../types';
import LiveCashoutsSection from '../LiveCashoutsSection';
import {
  PlayGamesIllustration,
  PlayGamesFloat1,
  PlayGamesFloat2,
  CompleteOffersIllustration,
  CompleteOffersFloat1,
  CompleteOffersFloat2,
  JoinSurveysIllustration,
  JoinSurveysFloat1,
  JoinSurveysFloat2,
} from '../earn/BestWaysIllustrations';

interface HomeStats {
  signups24h: number;
  avgTimeToFirstCash: string;
  avgWithdrawYesterday: number;
  totalEarned: number;
}

const DEFAULT_HOME_STATS: HomeStats = {
  signups24h: 101137,
  avgTimeToFirstCash: '17m 12s',
  avgWithdrawYesterday: 22.90,
  totalEarned: 300000000,
};

const formatTotalEarned = (n: number): string =>
  Math.floor(n).toLocaleString('en-US');

const HeroOfferCard: React.FC<{
  logo: string;
  name: string;
  description: string;
  payout: number;
  rating: number;
}> = ({ logo, name, description, payout, rating }) => {
  const dollars = Math.floor(payout);
  const cents = (payout % 1).toFixed(2).slice(2);

  return (
    <div className="bg-[#1a1f2e]/90 backdrop-blur-sm rounded-xl border border-white/10 p-3 text-left hover:border-green-500/30 transition-colors">
      <div className="bg-black/30 rounded-lg mb-3 flex items-center justify-center aspect-square overflow-hidden">
        <img src={logo} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-semibold text-white truncate text-sm">{name}</h3>
      <p className="text-slate-400 text-xs truncate mb-2">{description}</p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Up to</p>
          <div className="flex items-start text-white font-extrabold leading-none">
            <span className="text-lg">$</span>
            <span className="text-2xl">{dollars}</span>
            <span className="text-sm mt-0.5">.{cents}</span>
          </div>
        </div>
        <p className="text-yellow-400 text-xs flex items-center gap-0.5 shrink-0 mb-1">
          <i className="fas fa-star text-[10px]" />
          {rating.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

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

// Accordion item for the FAQ section with smooth transitions
const FaqAccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-6 hover:bg-white/5 focus:outline-none"
      >
        <span className="font-semibold text-lg text-white">{item.question}</span>
        <span
          className={`transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <i className="fas fa-chevron-down" />
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="px-6 pb-6 pt-0 text-slate-400">{item.answer}</div>
      </div>
    </div>
  );
};

const HighestPayoutsIcon = () => (
  <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
    <svg
      className="w-8 h-8 text-slate-300"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 28H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10 28V22H22V28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V16H20V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12 8L16 4L20 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const InstantCashoutsIcon = () => (
  <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
    <svg
      className="w-8 h-8 text-slate-300"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10H24C26.2091 10 28 11.7909 28 14V22C28 24.2091 26.2091 26 24 26H8C5.79086 26 4 24.2091 4 22V10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx="16"
        cy="18"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 6L28 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 12H28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M25 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const DailyBonusesIcon = () => (
  <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
    <svg
      className="w-8 h-8 text-slate-300"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 14H28V28H4V14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 28V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M28 14H4C4 9 8 4 16 4C24 4 28 9 28 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

interface EarningMethod {
  title: string;
  description: string;
  earnLabel: string;
  earnAmount: string;
  illustration: React.ReactNode;
  featured?: boolean;
  floatingElements?: { element: React.ReactNode; className: string }[];
}

const earningMethods: EarningMethod[] = [
  {
    title: 'Play games',
    description:
      'In order to attract more players, gaming companies want to pay you to play their games. Let\'s play!',
    earnLabel: 'Payout per game',
    earnAmount: '$1.00 - $120.00',
    illustration: <PlayGamesIllustration />,
    featured: true,
    floatingIcons: [
      floatingElements: [
      { element: <PlayGamesFloat1 />, className: 'earn-floating-1 earn-float-games-1' },
      { element: <PlayGamesFloat2 />, className: 'earn-floating-2 earn-float-games-2' },
    ],
  },
  {
    title: 'Complete offers',
    description:
      'Get to know new companies by trying their apps while you earn money. It\'s time to get paid for using apps!',
    earnLabel: 'Payout per completed offer',
    earnAmount: '$1.00 - $75.00',
    illustration: <CompleteOffersIllustration />,
    floatingElements: [
      { element: <CompleteOffersFloat1 />, className: 'earn-floating-1 earn-float-offers-1' },
      { element: <CompleteOffersFloat2 />, className: 'earn-floating-2 earn-float-offers-2' },
    ],
  },
  {
    title: 'Join surveys',
    description:
      'Companies need your opinion to create better products and services. That\'s why they pay for your feedback.',
    earnLabel: 'Average payout per 5–10 min survey',
    earnAmount: '$1.00',
    illustration: <JoinSurveysIllustration />,
    floatingElements: [
      { element: <JoinSurveysFloat1 />, className: 'earn-floating-1 earn-float-surveys-1' },
      { element: <JoinSurveysFloat2 />, className: 'earn-floating-2 earn-float-surveys-2' },
    ],
  },
];

const howItWorks = [
  {
    title: 'Create your account',
    description: 'Join free with your email—no credit card, no hidden fees.',
    icon: 'fa-user-plus',
  },
  {
    title: 'Pick offers you like',
    description: 'Choose games, apps, and surveys tailored to your interests.',
    icon: 'fa-clipboard-list',
  },
  {
    title: 'Cash out instantly',
    description: 'Withdraw earnings to your favorite payout method without waiting.',
    icon: 'fa-bolt',
  },
];

const siteBenefits = [
  {
    icon: <HighestPayoutsIcon />,
    title: 'Highest payouts',
    description:
      "Earn way more than on other sites. It's our goal to help you make as much money as possible.",
  },
  {
    icon: <InstantCashoutsIcon />,
    title: 'Instant cashouts',
    description:
      'Ready to get your money? The minimum cashout varies by region, between as little as $5 and $20, and payouts are almost instant.',
  },
  {
    icon: <DailyBonusesIcon />,
    title: 'Daily bonuses',
    description:
      'Climb the daily bonus ladder, reach the leaderboard, or start a streak to earn extra rewards, for free.',
  },
];

// Carousel items for the "Play games" section
const CAROUSEL_GAMES = [
    { name: 'Bubble Pop Shooter', payout: 236.25, image: 'https://shorturl.at/C13pw' },
    { name: 'Water Color Sorting', payout: 242.25, image: 'https://shorturl.at/vQjfV' },
    { name: 'Gangstar Vegas: World of Crime', payout: 355.80, image: 'https://shorturl.at/ej6b2' },
    { name: 'Pocket Styler', payout: 198.00, image: 'https://i.imgur.com/Y8H4yT6.png' },
    { name: 'Rock N\' Cash', payout: 681.20, image: 'https://i.imgur.com/U16jVoT.png' },
    { name: 'Sea Block 1010', payout: 274.30, image: 'https://i.imgur.com/SkxpAOW.png' },
    { name: 'Love Water', payout: 186.66, image: 'https://i.imgur.com/sUwOUgD.png' },
    { name: 'Zombie Survivor', payout: 210.50, image: 'https://i.imgur.com/kP4dmA8.png' },
];

const HomePageContent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { openSignupModal } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [homeStats, setHomeStats] = useState<HomeStats>(DEFAULT_HOME_STATS);

  useEffect(() => {
    const fetchHomeStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/home-stats`);
        if (response.ok) {
          const data: HomeStats = await response.json();
          setHomeStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch home stats:', error);
      }
    };
    fetchHomeStats();
  }, []);

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
  const [faqRef, isFaqInView] = useInView({ threshold: 0.15 });
  
  // Ref for the games carousel
  const gamesCarouselRef = useRef<HTMLDivElement>(null);
  const [gamesSectionRef, isGamesSectionInView] = useInView({ threshold: 0.1 });

  // Auto-slide effect for Games Carousel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isGamesSectionInView && !isPaused) {
        interval = setInterval(() => {
            if (gamesCarouselRef.current) {
                const carousel = gamesCarouselRef.current;
                const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
                // If close to end, scroll to start
                if (carousel.scrollLeft >= maxScrollLeft - 10) {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll right by approx one card width + gap (min-w-220px + 24px gap)
                    carousel.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }
        }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGamesSectionInView, isPaused]);

  const scrollGamesLeft = () => {
      if (gamesCarouselRef.current) {
          gamesCarouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
  };

  const scrollGamesRight = () => {
      if (gamesCarouselRef.current) {
          gamesCarouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
      <div className="relative w-full bg-[#141826] text-slate-300 overflow-x-hidden">
      <div>
        {/* Hero Section */}
        <section className="bg-[#141826] text-white">
          <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              {/* Left — headline + offers */}
              <div
                className={`transition-all duration-700 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.15] mb-5 text-white">
                  Monetize Your Free Time, Paid App and Game Testing
                </h1>
                <p className="text-slate-300 mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base">
                  <span>
                    Earn up to <span className="font-bold text-white">$350</span> per offer
                  </span>
                  <span className="text-green-400 text-lg hidden sm:inline">&bull;</span>
                  <span>
                    <span className="font-bold text-white">2,500+</span> Offers available now
                  </span>
                </p>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                  {FEATURED_OFFERS.map((offer) => (
                    <HeroOfferCard
                      key={offer.name}
                      logo={offer.logo}
                      name={offer.name}
                      description={offer.description}
                      payout={offer.payout}
                      rating={offer.rating}
                    />
                  ))}
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">See our reviews on</p>
                  <a
                    href="https://www.trustpilot.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <i className="fas fa-star text-green-500" />
                    <span className="text-lg font-bold text-white">Trustpilot</span>
                    <div
                      className="flex items-center ml-1 bg-[#00b67a] px-1.5 py-0.5"
                      style={{
                          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 95% 100%, 5% 100%, 0 70%)',
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star text-white text-xs px-0.5" />
                      ))}
                    </div>
                  </a>
                </div>
              </div>

            {/* Right — signup card */}
            <div
                className={`bg-[#1e2438] p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-1000 ease-out delay-200 ${
                  mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-5 text-center text-white">Sign Up for Free</h2>
                <form onSubmit={handleStartEarning}>
                  <div className="relative mb-3">
                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#141826] text-white p-3.5 pl-12 rounded-xl border border-slate-600/80 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mb-4 text-center leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-slate-400 hover:text-white underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-slate-400 hover:text-white underline">Privacy Policy</a>
                  </p>
                  <button
                  type="submit"
                    className="w-full bg-[#00D26A] hover:bg-[#00b85c] text-white font-bold py-3.5 rounded-xl mb-4 text-lg transition-colors shadow-lg shadow-green-500/20"
                  >
                    Start earning now
                  </button>
                </form>

                <div className="flex items-center my-5">
                  <hr className="flex-grow border-slate-600/60" />
                  <span className="mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">OR</span>
                  <hr className="flex-grow border-slate-600/60" />
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => openSignupModal()}
                    className="w-full bg-white text-slate-800 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-sm"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Sign Up with Google
                  </button>
                  <button
                    onClick={() => openSignupModal()}
                    className="w-full bg-[#1877F2] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors text-sm"
                  >
                    <i className="fab fa-facebook-f" /> Sign Up with Facebook
                  </button>
                  <button
                    onClick={() => openSignupModal()}
                    className="w-full bg-black text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors text-sm border border-white/10"
                  >
                    <i className="fab fa-apple text-lg" /> Sign Up with Apple
                  </button>
                </div>
              
              </div>
            </div>
            {/* Stats row — FreeCash-style, inside hero */}
            <div
              className={`mt-12 md:mt-16 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {homeStats.signups24h.toLocaleString()}+
                </p>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-snug">
                  sign ups in the past 24 hours
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {homeStats.avgTimeToFirstCash}
                </p>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-snug">
                  Avg. time to earn your first cash
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  ${homeStats.avgWithdrawYesterday.toFixed(2)}
                </p>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-snug">
                  Avg. withdrawal sent yesterday
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  ${formatTotalEarned(homeStats.totalEarned)}+
                </p>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-snug">
                  Total amount earned on Earnello
                </p>
              </div>
            </div>
          </div>
        </section>
        

        {/* Best ways to earn — FreeCash-style */}
        <section
          ref={bestWaysRef}
          className={`relative py-20 overflow-hidden bg-[#141826] transition-opacity duration-1000 ${
            isBestWaysInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12 md:mb-16">
              Best ways to earn
            </h2>

            <div className="space-y-6">
              {earningMethods.map((method, idx) => (
                <div
                  key={method.title}
                  onClick={() => openSignupModal()}
                  onKeyDown={(e) => e.key === 'Enter' && openSignupModal()}
                  role="button"
                  tabIndex={0}
                  className={`group relative rounded-2xl border bg-[#1a1f2e] overflow-hidden cursor-pointer transition-all duration-500 hover:border-white/20 hover:-translate-y-0.5 ${
                    method.featured ? 'border-green-500/30' : 'border-white/10'
                  } ${isBestWaysInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div
                    className={`flex flex-col ${
                      idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                    } items-center`}
                  >
                    <div className="relative w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center min-h-[260px] bg-[#141826] overflow-visible">
                      {method.floatingElements?.map((float, iconIdx) => (
                        <div
                          key={iconIdx}
                          className={`earn-floating-icon ${float.className}`}
                          aria-hidden
                        >
                          {float.element}
                        </div>
                      ))}
                      <div className="relative z-10 w-full max-w-[380px] transition-transform duration-300 group-hover:scale-[1.03]">
                        {method.illustration}
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 md:p-10 text-left">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {method.title}
                      </h3>
                      <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6">
                        {method.description}
                      </p>
                      <div className="inline-flex flex-col gap-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {method.earnLabel}
                        </span>
                        <span className="text-xl font-extrabold text-[#00D26A]">
                          {method.earnAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


         {/* How it works */}
        <section className="py-20 bg-[#141826]">
          <div className="container mx-auto px-8 text-center max-w-6xl">
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-400">Step-by-step</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-6">
              Start earning in minutes
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto mb-12">
              A streamlined flow built for speed: create your account, pick the offers you like, and cash out without waiting days for approvals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step, idx) => (
                <div
                  key={step.title}
                  className="relative h-full rounded-2xl border border-white/10 bg-[#1a1f2e] p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-300 text-xl">
                      <i className={`fas ${step.icon}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">Step {idx + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section
          ref={whyUsRef}
          className="relative py-20 overflow-hidden bg-[#141826]"
        >
          <div className="container mx-auto px-8 relative">
            {/* header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] rounded-full bg-white/5 text-slate-400 border border-white/10">
                Why us
              </span>

              <h2
                className={`text-4xl font-bold text-white mt-4 mb-4 transition-opacity duration-700 ${isWhyUsInView ? "opacity-100" : "opacity-0"
                  }`}
              >
                We&apos;re the #1 site to make money. Here&apos;s why
              </h2>

              <p className="text-slate-400 text-lg">
                Earning should feel premium—our payouts, speed, and daily boosts are wrapped
                in a platform built to look and feel trustworthy.
              </p>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteBenefits.map((benefit, i) => (
                <div
                  key={i}
                  className={`group relative h-full transition-all duration-500 ease-out ${isWhyUsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative h-full rounded-2xl border border-white/10 bg-[#1a1f2e] shadow-xl hover:-translate-y-2 hover:border-white/20 transition-all duration-300">
                    <div className="p-8 flex flex-col gap-4 h-full">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 text-slate-300">
                        {benefit.icon}
                      </div>

                      <div className="h-px w-10 bg-white/10" />

                      <h3 className="text-2xl font-bold text-white">
                        {benefit.title}
                      </h3>

                      <p className="text-slate-400 leading-relaxed">
                        {benefit.description}
                      </p>

                      <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-slate-500" />
                        Trusted by top earners
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

{/* New Games & Surveys Carousel Section */}
<section
  ref={gamesSectionRef}
  className={`relative py-20 overflow-hidden bg-[#141826] transition-opacity duration-1000 ${
    isGamesSectionInView ? "opacity-100" : "opacity-0"
  }`}
>
  <div className="container mx-auto px-4 sm:px-8 relative">
    {/* Header */}
    <div className="text-center max-w-4xl mx-auto mb-14">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-400 text-sm font-semibold border border-white/10">
        Fresh games & surveys — curated daily
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-4">
        Play games & take surveys to earn money
      </h2>

      <p className="text-slate-400 text-lg">
        Download mobile games, finish exciting levels, share your opinions on products,
        and cash out real rewards.
      </p>
    </div>

    {/* Carousel */}
    <div className="relative group">
      {/* Left Button */}
      <button
        onClick={scrollGamesLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-[#1a1f2e] rounded-full shadow-xl border border-white/10 flex items-center justify-center text-slate-300 hover:scale-110 transition-transform hidden md:flex opacity-0 group-hover:opacity-100 duration-300"
        aria-label="Scroll left"
      >
        <i className="fas fa-chevron-left" />
      </button>

      {/* Track */}
      <div
        ref={gamesCarouselRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CAROUSEL_GAMES.map((item, index) => (
          <div
            key={index}
            className="group min-w-[220px] bg-[#1a1f2e] rounded-2xl p-4 border border-white/10 shadow-lg hover:-translate-y-1 hover:border-white/20 transition-all duration-300 snap-start flex flex-col text-left cursor-pointer relative overflow-hidden"
          >
            {/* top row */}
            <div className="relative flex items-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center">
                <i className="fas fa-gamepad" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white line-clamp-1 text-base md:text-lg">
                  {item.name}
                </h3>
                <div className="text-xs text-slate-500">
                  Games & Surveys
                </div>
              </div>
            </div>

            {/* image */}
            <div className="relative rounded-xl overflow-hidden mb-4 border border-white/10">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
            </div>

            {/* footer row */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-300 font-semibold">
                Up to ${item.payout.toFixed(2)}
              </div>
              <span className="font-semibold text-white">
                Start now
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={scrollGamesRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-[#1a1f2e] rounded-full shadow-xl border border-white/10 flex items-center justify-center text-slate-300 hover:scale-110 transition-transform hidden md:flex opacity-0 group-hover:opacity-100 duration-300"
        aria-label="Scroll right"
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  </div>
</section>


      
 {/* Rewards Section */}
<section
  ref={rewardsRef}
  className="relative py-24 text-center overflow-hidden bg-[#141826]"
>
  <div className="container mx-auto px-6 relative z-10">
    {/* header */}
    <div className="max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-[0.2em] border border-white/10">
        Rewards Library
      </div>

      <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-5">
        Choose from 100+ Rewards
      </h2>

      <p className="text-lg text-slate-400 leading-relaxed">
        Withdraw cash or choose from hundreds of different gift cards.
      </p>
    </div>

    {/* grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {REWARD_OPTIONS.map((option, i) => (
        <div
          key={option.name}
          className={`relative group h-32 rounded-2xl border border-white/10 bg-[#1a1f2e] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 ${
            isRewardsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <div className="relative h-full w-full rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-2 p-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-semibold border border-white/10">
                In stock
              </div>

              <img
                src={option.imageUrl}
                alt={option.name}
                className="max-h-10 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />

              <div className="text-xs font-semibold text-slate-400 truncate w-full text-center">
                {option.name}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Testimonials Section */}
<section
  ref={testimonialsRef}
  className="relative py-20 bg-[#141826] overflow-hidden"
>
  <div className="container relative mx-auto px-8 text-center">
    {/* header */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
      <span className="text-sm font-semibold text-slate-400">
        Customer reviews
      </span>
    </div>

    <h2 className="text-4xl font-bold text-white mt-4 mb-12">
      Everybody loves Earnello.com
    </h2>

    {/* 3-up rotating grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left min-h-[300px]">
      {[0, 1, 2].map((offset) => {
        const index =
          (currentTestimonialIndex + offset) % TESTIMONIALS.length;
        const testimonial = TESTIMONIALS[index];

        return (
          <div
            key={`${testimonial.author}-${index}`}
            className={`relative rounded-2xl border border-white/10 bg-[#1a1f2e] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 ${
              isTestimonialsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${offset * 150}ms` }}
          >
            <div className="relative h-full w-full rounded-2xl p-8 flex flex-col overflow-hidden">
              <i className="fas fa-quote-left text-5xl text-white/10 absolute top-6 left-6" />

              <div className="relative z-10 flex flex-col flex-grow">
                <p className="text-slate-400 mb-6 flex-grow leading-relaxed">
                  {testimonial.text}
                </p>

                <div className="mt-auto">
                  <p className="font-bold text-white text-lg">
                    {testimonial.author}
                  </p>

                  <div className="flex items-center mt-2 gap-1">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className="h-2.5 w-2.5 rounded-full bg-amber-400"
                      />
                    ))}

                    <span className="ml-2 text-xs font-semibold text-slate-500 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* pagination controls */}
    <div className="flex items-center justify-center gap-6 mt-12">
      <button
        onClick={handlePrevTestimonial}
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1f2e] border border-white/10 hover:bg-[#222838] text-slate-400 hover:text-white transition-all active:scale-95"
        aria-label="Previous testimonial"
      >
        <i className="fas fa-chevron-left" />
      </button>

      <div className="flex items-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentTestimonialIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentTestimonialIndex
                ? "w-3 h-3 bg-white"
                : "w-2 h-2 bg-slate-600 hover:bg-slate-500"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={handleNextTestimonial}
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1f2e] border border-white/10 hover:bg-[#222838] text-slate-400 hover:text-white transition-all active:scale-95"
        aria-label="Next testimonial"
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  </div>
</section>


        {/* FAQ Section */}
<section
  ref={faqRef}
  className={`relative py-20 bg-[#141826] overflow-hidden transition-opacity duration-1000 ${
    isFaqInView ? "opacity-100" : "opacity-0"
  }`}
>
  <div className="container relative mx-auto px-8 max-w-4xl">
    {/* header */}
    <div className="text-center mb-10">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Support
          </span>
        </div>
      </div>

      <h2 className="text-4xl font-bold text-white mb-3">
        Your Earnello.com Questions Answered
      </h2>

      <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        Quick answers about getting started, payouts, and staying secure. Our team keeps
        this list fresh so you can focus on earning.
      </p>
    </div>

    {/* accordion */}
    <div className="rounded-2xl border border-white/10 bg-[#1a1f2e] shadow-lg divide-y divide-white/10">
      {FAQ_ITEMS.map((item, i) => (
        <FaqAccordionItem key={i} item={item} />
      ))}
    </div>
  </div>
</section>

        <LiveCashoutsSection />

      </div>
    </div>
  );
};

export default HomePageContent;
