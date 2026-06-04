import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../../App';
import { FAQ_ITEMS, REWARD_OPTIONS, TESTIMONIALS, FEATURED_OFFERS } from '../../constants';
import { API_URL } from '../../constants';
import type { FaqItem } from '../../types';
import OffersSection from '../../components/OffersSection';

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
    <div className="border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-6 hover:bg-slate-100/50 dark:hover:bg-slate-700/20 focus:outline-none"
      >
        <span className="font-semibold text-lg text-slate-900 dark:text-white">{item.question}</span>
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
        <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400">{item.answer}</div>
      </div>
    </div>
  );
};

const HighestPayoutsIcon = () => (
  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
    <svg
      className="w-8 h-8 text-green-400"
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
  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
    <svg
      className="w-8 h-8 text-green-400"
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
  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
    <svg
      className="w-8 h-8 text-green-400"
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

// Global small floating icons (flat cartoon style, external URLs)
const GLOBAL_FLOATING_ICONS = [
  { src: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=002", className: "global-floating-1" }, // Bitcoin Neon
  { src: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002", className: "global-floating-2" }, // Ethereum Neon
  { src: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=002", className: "global-floating-3" }, // Binance Neon
  { src: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=002", className: "global-floating-4" }, // Gamepad Neon
];

interface EarningMethod {
  title: string;
  description: string;
  earnLabel: string;
  earnAmount: string;
  baseImage: string;
  featured?: boolean;
}

const earningMethods: EarningMethod[] = [
  {
    title: 'Play games & get paid',
    description:
      'Game studios are happy to reward you just for trying out their games. Pick a game you like, play a few levels and collect real cash while you have fun.',
    earnLabel: 'Payout per game',
    earnAmount: '$1.00 - $120.00',
    baseImage:
      'https://res.cloudinary.com/dsezfqke7/image/upload/v1763588048/nanao_base_czw9lt.png',
    featured: true,
  },
  {
    title: 'Try new apps & offers',
    description:
      'Discover new brands and apps, install or complete a few simple steps, and earn money for each offer you finish — it’s like getting paid to explore.',
    earnLabel: 'Payout per completed offer',
    earnAmount: '$1.00 - $75.00',
    baseImage: 'https://res.cloudinary.com/dsezfqke7/image/upload/v1764389619/ux6374WcpaIBn8-weIQNzffOk9re64pqHEdhsDb3CS58i8IJLI0-JznM8rQ3803NUws_w416-h235-rw_k9uqha.webp',
  },
  {
    title: 'Share your opinion in surveys',
    description:
      'Brands rely on honest feedback to improve their products, and they’re willing to reward you for your time. Answer a few quick questions and turn your opinions into cash.',
    earnLabel: 'Average payout per 5–10 min survey',
    earnAmount: '$1.00',
    baseImage: 'https://i.imgur.com/tcAqi0j.png',
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
    <div className="relative bg-white dark:bg-[#0b111e] text-slate-700 dark:text-slate-300 overflow-x-hidden">
      {/* 🔥 Global flat cartoon floating icons (background layer) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {GLOBAL_FLOATING_ICONS.map((icon, idx) => (
          <img
            key={idx}
            src={icon.src}
            alt={`floating-icon-${idx}`}
            className={`global-floating-icon ${icon.className}`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section — FreeCash-inspired layout */}
        <section className="bg-[#141826] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(52,211,153,0.08)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.06)_0%,_transparent_50%)]" />
          
          <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 relative z-10">
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
        

        {/* ✅ Offers Section (replacing Best ways to earn) */}
        <OffersSection />


         {/* How it works */}
        <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#0b111e] dark:via-[#0d1527] dark:to-[#0b111e]">
          <div className="container mx-auto px-8 text-center max-w-6xl">
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-green-400">Step-by-step</span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-6">
              Start earning in minutes
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
              A streamlined flow built for speed: create your account, pick the offers you like, and cash out without waiting days for approvals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step, idx) => (
                <div
                  key={step.title}
                  className="relative h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 text-green-400 text-xl">
                      <i className={`fas ${step.icon}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Step {idx + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                  <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section
          ref={whyUsRef}
          className="relative py-20 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#0b111e] dark:via-[#0f172a] dark:to-[#0b111e]"
        >
          {/* soft glow background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-20 -top-32 h-64 w-64 bg-gradient-to-br from-green-400/20 via-emerald-500/20 to-teal-400/10 blur-3xl" />
            <div className="absolute -right-12 bottom-0 h-80 w-80 bg-gradient-to-tr from-emerald-500/15 via-green-400/10 to-cyan-300/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-8 relative">
            {/* header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] rounded-full bg-green-500/10 text-green-500 border border-green-500/30">
                Why us
              </span>

              <h2
                className={`text-4xl font-bold text-slate-900 dark:text-white mt-4 mb-4 transition-opacity duration-700 ${isWhyUsInView ? "opacity-100" : "opacity-0"
                  }`}
              >
                We&apos;re the #1 site to make money.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
                  Here&apos;s why
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-lg">
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
                  {/* outer glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/25 via-emerald-400/15 to-teal-400/25 opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />

                  {/* card body */}
                  <div className="relative h-full rounded-2xl border border-white/50 dark:border-white/5 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    <div className="p-8 flex flex-col gap-4 h-full">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/15 via-emerald-400/20 to-teal-400/20 text-green-400 shadow-inner">
                        {benefit.icon}
                      </div>

                      <div className="h-px w-10 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {benefit.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {benefit.description}
                      </p>

                      <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-green-500">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
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
  className={`relative py-20 overflow-hidden transition-opacity duration-1000 ${
    isGamesSectionInView ? "opacity-100" : "opacity-0"
  }`}
>
  {/* Background gradient + soft glows */}
  <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-[#0b111e] dark:via-[#0f172a] dark:to-[#0b111e]" />
  <div className="absolute inset-0 opacity-40 blur-3xl pointer-events-none" aria-hidden>
    <div className="absolute -top-10 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-green-400/25 via-emerald-300/20 to-teal-300/20" />
    <div className="absolute bottom-0 -right-10 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-400/20 via-green-300/15 to-teal-300/25" />
  </div>

  <div className="container mx-auto px-4 sm:px-8 relative">
    {/* Header */}
    <div className="text-center max-w-4xl mx-auto mb-14">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/15 via-emerald-400/15 to-teal-400/15 text-green-600 dark:text-green-300 text-sm font-semibold border border-green-500/20 dark:border-green-400/15 shadow-inner">
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        Fresh games & surveys — curated daily
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 mb-4">
        Play games & take surveys to earn money
      </h2>

      <p className="text-slate-600 dark:text-slate-400 text-lg">
        Download mobile games, finish exciting levels, share your opinions on products,
        and cash out real rewards — all styled to match our premium vibe.
      </p>
    </div>

    {/* Carousel */}
    <div className="relative group">
      {/* Left Button */}
      <button
        onClick={scrollGamesLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white/90 dark:bg-slate-900/80 rounded-full shadow-xl border border-white/40 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform hidden md:flex opacity-0 group-hover:opacity-100 duration-300 backdrop-blur"
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
            className="group min-w-[220px] bg-white/80 dark:bg-[#111827]/80 backdrop-blur-lg rounded-2xl p-4 border border-white/40 dark:border-slate-800 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 snap-start flex flex-col text-left cursor-pointer relative overflow-hidden"
          >
            {/* hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute -top-10 -right-14 w-32 h-32 rounded-full bg-gradient-to-br from-green-300/30 via-emerald-200/25 to-teal-200/25 blur-3xl" />
            </div>

            {/* top row */}
            <div className="relative flex items-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg">
                <i className="fas fa-gamepad" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 text-base md:text-lg">
                  {item.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Games & Surveys
                </div>
              </div>
            </div>

            {/* image */}
            <div className="relative rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-70" />
            </div>

            {/* footer row */}
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/15 via-emerald-400/15 to-teal-400/15 text-green-600 dark:text-green-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Up to ${item.payout.toFixed(2)}
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                Start now
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={scrollGamesRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white/90 dark:bg-slate-900/80 rounded-full shadow-xl border border-white/40 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform hidden md:flex opacity-0 group-hover:opacity-100 duration-300 backdrop-blur"
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
  className="relative py-24 text-center overflow-hidden"
>
  {/* background */}
  <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#0f172a] dark:via-[#0b1223] dark:to-[#0f172a]" />
  <div className="absolute inset-0 opacity-60 pointer-events-none" aria-hidden>
    <div className="absolute -left-24 top-10 w-72 h-72 rounded-full bg-gradient-to-br from-green-500/25 via-emerald-400/10 to-teal-300/15 blur-3xl" />
    <div className="absolute right-10 -bottom-10 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/15 via-green-400/10 to-teal-300/20 blur-3xl" />
  </div>

  <div className="container mx-auto px-6 relative z-10">
    {/* header */}
    <div className="max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/15 via-emerald-400/20 to-teal-400/15 text-green-600 dark:text-green-300 text-xs font-semibold uppercase tracking-[0.2em] border border-green-200/40 dark:border-emerald-700/40 shadow-sm">
        Rewards Library
      </div>

      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 mb-5">
        Choose from{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 font-bold">
          100+ Rewards
        </span>
      </h2>

      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        Withdraw cash or choose from hundreds of different gift cards.
      </p>
    </div>

    {/* grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {REWARD_OPTIONS.map((option, i) => (
        <div
          key={option.name}
          className={`relative group h-32 rounded-2xl p-[1px] bg-gradient-to-br from-white via-emerald-100/60 to-green-200/70 dark:from-white/10 dark:via-emerald-500/10 dark:to-green-500/20 shadow-[0_20px_45px_-15px_rgba(16,185,129,0.35)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(16,185,129,0.45)] ${
            isRewardsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <div className="relative h-full w-full rounded-2xl bg-white/95 dark:bg-[#111827]/80 backdrop-blur-lg border border-white/70 dark:border-emerald-500/10 flex items-center justify-center overflow-hidden">
            {/* hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute -top-10 -right-14 w-28 h-28 rounded-full bg-gradient-to-br from-emerald-200/40 via-green-300/30 to-teal-200/30 blur-2xl" />
              <div className="absolute -bottom-10 -left-14 w-24 h-24 rounded-full bg-gradient-to-tr from-green-300/30 via-emerald-200/25 to-teal-200/25 blur-2xl" />
            </div>

            {/* content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-2 p-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-300 text-xs font-semibold border border-green-200/50 dark:border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                In stock
              </div>

              <img
                src={option.imageUrl}
                alt={option.name}
                className="max-h-10 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />

              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate w-full text-center">
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
  className="relative py-20 bg-slate-50 dark:bg-[#0f1729] overflow-hidden"
>
  {/* background + glows */}
  <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/25 via-transparent to-emerald-100/15 dark:from-emerald-400/5 dark:via-emerald-500/0 dark:to-cyan-500/10" />
  <div className="absolute -right-24 -top-24 w-64 h-64 bg-gradient-to-br from-emerald-300/25 via-teal-200/25 to-cyan-200/20 blur-3xl pointer-events-none" />
  <div className="absolute -left-32 -bottom-24 w-72 h-72 bg-gradient-to-tr from-cyan-300/20 via-emerald-200/15 to-teal-200/20 blur-3xl pointer-events-none" />

  <div className="container relative mx-auto px-8 text-center">
    {/* header */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-green-500/15 border border-white/60 dark:border-emerald-500/20 shadow-[0_10px_40px_-18px_rgba(16,185,129,0.45)]">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-200">
        Customer reviews
      </span>
    </div>

    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-4 mb-12">
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
            className={`relative p-[1px] rounded-2xl bg-gradient-to-br from-white via-emerald-100/70 to-green-200/60 dark:from-emerald-500/10 dark:via-cyan-500/5 dark:to-emerald-500/15 shadow-[0_25px_65px_-25px_rgba(16,185,129,0.5)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_30px_70px_-22px_rgba(16,185,129,0.65)] ${
              isTestimonialsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${offset * 150}ms` }}
          >
            <div className="relative h-full w-full rounded-2xl bg-white/95 dark:bg-[#111827]/85 backdrop-blur-lg border border-white/60 dark:border-emerald-500/15 p-8 flex flex-col overflow-hidden">
              {/* inner glows */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-300/20 via-cyan-200/20 to-green-200/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-300/15 via-emerald-200/15 to-green-200/15 blur-3xl pointer-events-none" />

              <i className="fas fa-quote-left text-5xl text-emerald-400/40 absolute top-6 left-6" />

              <div className="relative z-10 flex flex-col flex-grow">
                <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow leading-relaxed">
                  {testimonial.text}
                </p>

                <div className="mt-auto">
                  <p className="font-bold text-slate-900 dark:text-white text-lg">
                    {testimonial.author}
                  </p>

                  <div className="flex items-center mt-2 gap-1">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_6px_18px_-6px_rgba(251,191,36,0.8)]"
                      />
                    ))}

                    <span className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-200 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-400/20">
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
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-[#1e2235] hover:bg-slate-300 dark:hover:bg-[#2a2f44] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
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
                ? "w-3 h-3 bg-slate-800 dark:bg-white"
                : "w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={handleNextTestimonial}
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-[#1e2235] hover:bg-slate-300 dark:hover:bg-[#2a2f44] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
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
  className={`relative py-20 bg-slate-50 dark:bg-[#0f1729] overflow-hidden transition-opacity duration-1000 ${
    isFaqInView ? "opacity-100" : "opacity-0"
  }`}
>
  {/* background + glows */}
  <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/25 via-transparent to-emerald-200/20 dark:from-emerald-500/5 dark:via-transparent dark:to-cyan-500/10" />
  <div className="absolute -left-24 top-10 w-56 h-56 bg-gradient-to-br from-emerald-300/25 via-teal-200/25 to-cyan-200/20 blur-3xl pointer-events-none" />
  <div className="absolute -right-20 bottom-0 w-64 h-64 bg-gradient-to-tr from-cyan-300/20 via-emerald-200/15 to-green-200/20 blur-3xl pointer-events-none" />

  <div className="container relative mx-auto px-8 max-w-4xl">
    {/* header */}
    <div className="text-center mb-10">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-green-500/15 border border-white/60 dark:border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-200 uppercase tracking-wide">
            Support
          </span>
        </div>
      </div>

      <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
        Your Earnello.com Questions Answered
      </h2>

      <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        Quick answers about getting started, payouts, and staying secure. Our team keeps
        this list fresh so you can focus on earning.
      </p>
    </div>

    {/* accordion */}
    <div className="p-[1px] rounded-2xl bg-gradient-to-br from-white via-emerald-100/70 to-green-200/60 dark:from-emerald-500/10 dark:via-cyan-500/5 dark:to-emerald-500/15 shadow-[0_25px_65px_-25px_rgba(16,185,129,0.5)]">
      <div className="bg-white/95 dark:bg-[#111827]/85 backdrop-blur-lg rounded-2xl shadow-lg border border-white/60 dark:border-emerald-500/15 divide-y divide-slate-200/70 dark:divide-emerald-500/10">
        {FAQ_ITEMS.map((item, i) => (
          <FaqAccordionItem key={i} item={item} />
        ))}
      </div>
    </div>
  </div>
</section>

      </div>
    </div>
  );
};

export default HomePageContent;
