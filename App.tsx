import React, { useState, useCallback, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoggedOutHeader from './components/LoggedOutHeader';
import WalletModal from './components/WalletModal';
import LiveEarningFeed from './components/LiveEarningFeed';
import Footer from './components/Footer';
import type { User } from './types';
import LoggedOutSidebar from './components/LoggedOutSidebar';
import SigninModal from './components/SigninModal';
import SignupModal from './components/SignupModal';
import SupportChatModal from './components/SupportChatModal';

// Lazy load page components
const HomePageContent = React.lazy(() => import('./components/pages/HomePage'));
const LoggedInHomePage = React.lazy(() => import('./components/pages/LoggedInHomePage'));
const DashboardPage = React.lazy(() => import('./components/pages/DashboardPage'));
const OfferPage = React.lazy(() => import('./components/pages/OfferPage'));
const TasksPage = React.lazy(() => import('./components/pages/TasksPage'));
const SurveysPage = React.lazy(() => import('./components/pages/SurveysPage'));
const ReferralsPage = React.lazy(() => import('./components/pages/ReferralsPage'));
const LeaderboardPage = React.lazy(() => import('./components/pages/LeaderboardPage'));
const DailyBonusPage = React.lazy(() => import('./components/pages/DailyBonusPage'));
const AchievementsPage = React.lazy(() => import('./components/pages/AchievementsPage'));
const ChatPage = React.lazy(() => import('./components/pages/ChatPage'));

// Lazy load survey provider pages
const PrimeSurveysPage = React.lazy(() => import('./components/pages/survey/PrimeSurveysPage'));
const CPXResearchPage = React.lazy(() => import('./components/pages/survey/CPXResearchPage'));
const AdscendMediaSurveysPage = React.lazy(() => import('./components/pages/survey/AdscendMediaSurveysPage'));
const BitLabsSurveysPage = React.lazy(() => import('./components/pages/survey/BitLabsSurveysPage'));
const InBrainPage = React.lazy(() => import('./components/pages/survey/InBrainPage'));
const TheoremReachPage = React.lazy(() => import('./components/pages/survey/TheoremReachPage'));
const PollfishSurveysPage = React.lazy(() => import('./components/pages/survey/PollfishSurveysPage'));

// Lazy load offer provider pages
const ToroxPage = React.lazy(() => import('./components/pages/offers/ToroxPage'));
const AdscendMediaPage = React.lazy(() => import('./components/pages/offers/AdscendMediaPage'));
const AdToWallPage = React.lazy(() => import('./components/pages/offers/AdToWallPage'));
const RevUPage = React.lazy(() => import('./components/pages/offers/RevUPage'));
const AdGateMediaPage = React.lazy(() => import('./components/pages/offers/AdGateMediaPage'));
const MyChipsPage = React.lazy(() => import('./components/pages/offers/MyChipsPage'));
const MMWallPage = React.lazy(() => import('./components/pages/offers/MMWallPage'));
const AyeTStudiosPage = React.lazy(() => import('./components/pages/offers/AyeTStudiosPage'));
const MonlixPage = React.lazy(() => import('./components/pages/offers/MonlixPage'));
const HangMyAdsPage = React.lazy(() => import('./components/pages/offers/HangMyAdsPage'));
const LootablyPage = React.lazy(() => import('./components/pages/offers/LootablyPage'));
const TimeWallPage = React.lazy(() => import('./components/pages/offers/TimeWallPage'));
const AdGemPage = React.lazy(() => import('./components/pages/offers/AdGemPage'));

// Lazy load admin panel
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminLoginPage = React.lazy(() => import('./components/admin/AdminLoginPage'));


export const AppContext = React.createContext<{
  isLoggedIn: boolean;
  user: User | null;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  handleLogin: (token: string, user: User) => void;
  handleLogout: () => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSigninModalOpen: boolean;
  setIsSigninModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignupModalOpen: boolean;
  openSignupModal: (email?: string) => void;
  currentPage: string;
  setCurrentPage: (pageName: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  isSupportChatModalOpen: boolean;
  setIsSupportChatModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isLoggedIn: false,
  user: null,
  balance: 0,
  setBalance: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
  isWalletModalOpen: false,
  setIsWalletModalOpen: () => {},
  isSigninModalOpen: false,
  setIsSigninModalOpen: () => {},
  isSignupModalOpen: false,
  openSignupModal: () => {},
  currentPage: 'Home',
  setCurrentPage: () => {},
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: () => {},
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: () => {},
  theme: 'dark',
  setTheme: () => {},
  isSupportChatModalOpen: false,
  setIsSupportChatModalOpen: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

const PageLoader: React.FC = () => (
    <div className="flex items-center justify-center h-full w-full p-8">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

// Storing the static page components outside the App component prevents them from being recreated on every render.
const pageComponentsMap: { [key: string]: React.ReactNode } = {
    'Profile': <DashboardPage />,
    'Offer': <OfferPage />,
    'Tasks': <TasksPage />,
    'Surveys': <SurveysPage />,
    'Prime Surveys': <PrimeSurveysPage />,
    'CPX Research': <CPXResearchPage />,
    'Adscend Media Surveys': <AdscendMediaSurveysPage />,
    'BitLabs': <BitLabsSurveysPage />,
    'inBrain': <InBrainPage />,
    'Pollfish': <PollfishSurveysPage />,
    'TheoremReach': <TheoremReachPage />,
    'Torox': <ToroxPage />,
    'Adscend Media': <AdscendMediaPage />,
    'AdToWall': <AdToWallPage />,
    'RevU': <RevUPage />,
    'AdGate Media': <AdGateMediaPage />,
    'MyChips': <MyChipsPage />,
    'MM Wall': <MMWallPage />,
    'Aye-T Studios': <AyeTStudiosPage />,
    'Monlix': <MonlixPage />,
    'Hang My Ads': <HangMyAdsPage />,
    'Lootably': <LootablyPage />,
    'Time Wall': <TimeWallPage />,
    'AdGem': <AdGemPage />,
    'Referrals': <ReferralsPage />,
    'Leaderboard': <LeaderboardPage />,
    'Daily Bonus': <DailyBonusPage />,
    'Achievements': <AchievementsPage />,
    'Chat': <ChatPage />,
    'Boxes': <div className="text-slate-900 dark:text-white text-3xl font-bold">Boxes Page</div>,
    'Battles': <div className="text-slate-900 dark:text-white text-3xl font-bold">Battles Page</div>,
};

// Create a lookup map to find the original page name (with spaces) from a URL-friendly version (without spaces)
const pageKeyLookup = Object.keys(pageComponentsMap).reduce((lookup, key) => {
    const keyWithoutSpaces = key.replace(/\s/g, '');
    lookup[keyWithoutSpaces] = key;
    return lookup;
}, {} as Record<string, string>);

// Helper function to ensure numeric fields from the API/localStorage are numbers
const sanitizeUser = (rawUser: User): User => {
    const user = { ...rawUser };
    const numericKeys: (keyof User)[] = [
        'xp', 'xpToNextLevel', 'totalEarned', 'last30DaysEarned',
        'completedTasks', 'totalWagered', 'totalProfit', 'totalWithdrawn',
        'totalReferrals', 'referralEarnings'
    ];

    for (const key of numericKeys) {
        if (user[key] !== undefined && user[key] !== null) {
            // @ts-ignore - TS has trouble with dynamic keys on interfaces
            user[key] = Number(user[key]);
        }
    }
    return user;
};


const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSupportChatModalOpen, setIsSupportChatModalOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signupInitialEmail, setSignupInitialEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('Home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
  });
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const navigate = useCallback((pageName: string) => {
    const hashName = pageName.replace(/\s/g, '');
    const newHash = pageName === 'Home' ? '' : `#/${hashName}`;
    if (window.location.hash !== newHash) {
        window.location.hash = newHash;
    }
  }, []);

  const handleLogin = useCallback((token: string, userData: User) => {
    localStorage.setItem('token', token);
    const sanitizedUser = sanitizeUser(userData);
    localStorage.setItem('user', JSON.stringify(sanitizedUser));
    setUser(sanitizedUser);
    setBalance(sanitizedUser.totalEarned || 0);
    setIsLoggedIn(true);

    if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
      setRedirectAfterLogin(null);
    } else {
      navigate('Home');
    }
    
    setIsSigninModalOpen(false);
    setIsSignupModalOpen(false);
  }, [navigate, redirectAfterLogin]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setRedirectAfterLogin(null);
    navigate('Home');
  }, [navigate]);
  
  useEffect(() => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData && typeof userData === 'object') {
                const sanitizedUser = sanitizeUser(userData as User);
                setUser(sanitizedUser);
                setBalance(sanitizedUser.totalEarned || 0);
                setIsLoggedIn(true);
            } else {
                handleLogout();
            }
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        handleLogout();
      } finally {
        setIsLoadingAuth(false);
      }
  }, [handleLogout]);


  useEffect(() => {
    if (isLoadingAuth) {
        return;
    }
    
    const handleUrlChange = () => {
        const hash = window.location.hash;
        const getPageFromHash = () => {
            if (hash.startsWith('#/')) {
                const pageName = hash.substring(2);
                if (pageName.toLowerCase().startsWith('admin')) return pageName;
                return decodeURIComponent(pageName.split('?')[0]);
            }
            return null;
        };

        const pageFromHash = getPageFromHash();

        if (pageFromHash?.toLowerCase().startsWith('admin')) {
            // Admin routing is handled separately and does not set currentPage
            return;
        }

        const requestedPageKey = pageFromHash || 'Home';
        const requestedPageName = pageKeyLookup[requestedPageKey] || Object.keys(pageComponentsMap).find(k => k === requestedPageKey) || 'Home';
        
        const isProtectedRoute = requestedPageName !== 'Home';

        if (isProtectedRoute && !isLoggedIn) {
            setRedirectAfterLogin(requestedPageName);
            navigate('Home'); 
            setIsSigninModalOpen(true);
        } else {
            setCurrentPage(requestedPageName);
        }
    };
  
    handleUrlChange(); // Set initial page
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
        window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [isLoggedIn, navigate, isLoadingAuth]);
  
  const openSignupModal = (email = '') => {
      setSignupInitialEmail(email);
      setIsSignupModalOpen(true);
  };

  const appContextValue = { 
      isLoggedIn, user, balance, setBalance, handleLogin, handleLogout,
      isWalletModalOpen, setIsWalletModalOpen, isSigninModalOpen, 
      setIsSigninModalOpen, isSignupModalOpen, openSignupModal, 
      currentPage, setCurrentPage: navigate, 
      isSidebarCollapsed, setIsSidebarCollapsed, isMobileSidebarOpen, 
      setIsMobileSidebarOpen, theme, setTheme, isSupportChatModalOpen, 
      setIsSupportChatModalOpen, isAdmin, setIsAdmin
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  if (isLoadingAuth) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-[#0f172a]">
            <PageLoader />
        </div>
    );
  }

  if (window.location.hash.startsWith('#/admin')) {
      if (!isAdmin) {
          return (
              <Suspense fallback={<PageLoader />}>
                  <AdminLoginPage onLoginSuccess={() => setIsAdmin(true)} />
              </Suspense>
          );
      }
      return (
          <AppContext.Provider value={appContextValue}>
            <Suspense fallback={<PageLoader />}>
                <AdminLayout />
            </Suspense>
          </AppContext.Provider>
      );
  }
  
  const getPageFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/')) {
          const pageName = hash.substring(2);
          if (pageName.toLowerCase().startsWith('admin')) return null;
          return decodeURIComponent(pageName.split('?')[0]);
      }
      return null;
  };
  
  const dedicatedPageNameFromHash = getPageFromHash();
  const dedicatedPageName = dedicatedPageNameFromHash ? (pageKeyLookup[dedicatedPageNameFromHash] || Object.keys(pageComponentsMap).find(k => k === dedicatedPageNameFromHash)) : null;

  const dedicatedPageNames = new Set([
    'Prime Surveys', 'CPX Research', 'Adscend Media Surveys', 'BitLabs', 'inBrain', 'Pollfish', 'TheoremReach',
    'Torox', 'Adscend Media', 'AdToWall', 'RevU', 'AdGate Media', 'MyChips', 'MM Wall', 'Aye-T Studios',
    'Monlix', 'Hang My Ads', 'Lootably', 'Time Wall', 'AdGem'
  ]);
  
  const isDedicatedView = !!dedicatedPageName && dedicatedPageNames.has(dedicatedPageName);
  
  const switchToSignup = () => {
      setIsSigninModalOpen(false);
      setIsSignupModalOpen(true);
  };

  const switchToSignin = () => {
      setIsSignupModalOpen(false);
      setIsSigninModalOpen(true);
  };

  if (isDedicatedView) {
      const pageName = dedicatedPageName;
      const ComponentToRender = pageName ? pageComponentsMap[pageName] : null;

      if (!ComponentToRender) {
          return (
              <div className="bg-slate-100 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300 min-h-screen flex items-center justify-center">
                  <h1 className="text-3xl font-bold">Page Not Found</h1>
              </div>
          );
      }

      return (
        <AppContext.Provider value={appContextValue}>
          <div className="bg-slate-100 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300 min-h-screen">
              <Suspense fallback={<PageLoader />}>
                  <div className="p-4 sm:p-6 lg:p-8">
                      {ComponentToRender}
                  </div>
              </Suspense>
          </div>
        </AppContext.Provider>
      );
  }

  const renderPage = () => {
    const pagePadding = "p-4 sm:p-6 lg:p-8";
    let componentToRender;

    if (currentPage === 'Home') {
        componentToRender = isLoggedIn ? <LoggedInHomePage /> : <HomePageContent />;
    } else {
        componentToRender = pageComponentsMap[currentPage];
    }
    
    // Fallback to the homepage if the page is not found
    if (!componentToRender) {
        componentToRender = isLoggedIn ? <LoggedInHomePage /> : <HomePageContent />;
    }

    return <div className={pagePadding}>{componentToRender}</div>;
  };
  
  const headerContent = isLoggedIn ? <Header onLogout={handleLogout} /> : <LoggedOutHeader />;
  const mainContent = renderPage();

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="flex h-screen bg-slate-100 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300">
        {isLoggedIn ? <Sidebar /> : <LoggedOutSidebar />}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <header className="sticky top-0 z-20 shrink-0">
                {headerContent}
                <LiveEarningFeed />
            </header>
            <div className="flex-1 flex flex-col">
              <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    {mainContent}
                  </Suspense>
              </main>
              <Footer />
            </div>
        </div>
        {isLoggedIn && <WalletModal />}
        {isLoggedIn && <SupportChatModal isOpen={isSupportChatModalOpen} onClose={() => setIsSupportChatModalOpen(false)} />}
        {!isLoggedIn && (
            <>
                <SigninModal
                    isOpen={isSigninModalOpen}
                    onClose={() => setIsSigninModalOpen(false)}
                    onSwitchToSignup={switchToSignup}
                />
                <SignupModal
                    isOpen={isSignupModalOpen}
                    onClose={() => setIsSignupModalOpen(false)}
                    initialEmail={signupInitialEmail}
                    onSwitchToSignin={switchToSignin}
                />
            </>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;