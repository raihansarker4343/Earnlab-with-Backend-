import React, { useState, useCallback, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoggedOutHeader from './components/LoggedOutHeader';
import WalletModal from './components/WalletModal';
import LiveEarningFeed from './components/LiveEarningFeed';
import Footer from './components/Footer';
import type { User, Transaction } from './types';
import LoggedOutSidebar from './components/LoggedOutSidebar';
import SigninModal from './components/SigninModal';
import SignupModal from './components/SignupModal';
import SupportChatModal from './components/SupportChatModal';
import { API_URL } from './constants';


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
const YourSurveysPage = React.lazy(() => import('./components/pages/survey/YourSurveysPage'));

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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  handleLogin: (token: string, user: User) => Promise<void>;
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
  setUser: () => {},
  balance: 0,
  setBalance: () => {},
  transactions: [],
  setTransactions: () => {},
  handleLogin: async () => {},
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
    'Your-Surveys': <YourSurveysPage />,
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
        'xp', 'xpToNextLevel', 'totalEarned', 'balance', 'last30DaysEarned',
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

const getPageFromHash = (hash: string): string => {
    if (!hash || hash === '#' || hash === '#/') return 'Home';
    // Remove # or #/ from the beginning of the string
    const pageKey = hash.startsWith('#/') ? hash.substring(2) : hash.substring(1);
    const cleanPageKey = pageKey.split('?')[0];

    if (cleanPageKey.toLowerCase().startsWith('admin')) return cleanPageKey;

    return pageKeyLookup[cleanPageKey] || Object.keys(pageComponentsMap).find(k => k === cleanPageKey) || 'Home';
};


const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSupportChatModalOpen, setIsSupportChatModalOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signupInitialEmail, setSignupInitialEmail] = useState('');
  const [page, setPage] = useState('Home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
  });
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const navigate = useCallback((pageName: string) => {
      const pageKey = pageName === 'Home' ? '/' : `/${pageName.replace(/\s/g, '')}`;
      const newHash = `#${pageKey}`;
      if (window.location.hash !== newHash) {
          window.location.hash = newHash;
      }
  }, []);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setRedirectAfterLogin(null);
    setTransactions([]);
    navigate('Home');
  }, [navigate]);

  const handleLogin = useCallback(async (token: string, userData: User) => {
    localStorage.setItem('token', token);
    const sanitizedUser = sanitizeUser(userData);
    localStorage.setItem('user', JSON.stringify(sanitizedUser));
    
    try {
        const response = await fetch(`${API_URL}/api/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const userTransactions: Transaction[] = await response.json();
        
        // FIX: The amount from the backend is a string, convert it to a number.
        const parsedTransactions = userTransactions.map(tx => ({
            ...tx,
            amount: Number(tx.amount)
        }));
        
        setTransactions(parsedTransactions);
        
        setBalance(sanitizedUser.balance || 0);
        setUser(sanitizedUser);
        setIsLoggedIn(true);

        const targetPage = redirectAfterLogin || 'Home';
        navigate(targetPage);
        setRedirectAfterLogin(null);
        
        setIsSigninModalOpen(false);
        setIsSignupModalOpen(false);
    } catch (error) {
        console.error("Login failed:", error);
        handleLogout(); // Log out if we can't fetch essential data
    }
  }, [navigate, redirectAfterLogin, handleLogout]);

  // Effect for initial auth check from localStorage.
  useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          if (token && storedUser) {
              const userData = JSON.parse(storedUser);
              if (userData && typeof userData === 'object') {
                  await handleLogin(token, userData as User);
              }
          }
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } finally {
          setIsLoadingAuth(false);
        }
      };
      checkAuth();
  }, [handleLogin]);

  // Effect to handle routing via hash changes.
  useEffect(() => {
    if (isLoadingAuth) return; // Wait for auth check to complete

    const handleHashChange = () => {
        const pageFromHash = getPageFromHash(window.location.hash);
        
        const isProtectedRoute = pageFromHash !== 'Home';
        if (isProtectedRoute && !isLoggedIn) {
            setRedirectAfterLogin(pageFromHash);
            navigate('Home');
            setIsSigninModalOpen(true);
        } else {
            setPage(pageFromHash);
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial page load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isLoadingAuth, isLoggedIn, navigate]);
  
  const openSignupModal = (email = '') => {
      setSignupInitialEmail(email);
      setIsSignupModalOpen(true);
  };

  const appContextValue = { 
      isLoggedIn, user, setUser, balance, setBalance, transactions, setTransactions, handleLogin, handleLogout,
      isWalletModalOpen, setIsWalletModalOpen, isSigninModalOpen, 
      setIsSigninModalOpen, isSignupModalOpen, openSignupModal, 
      currentPage: page,
      setCurrentPage: navigate,
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

  // Admin panel routing
  if (window.location.pathname.startsWith('/admin')) {
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
  
  const dedicatedPageNames = new Set([
    'Prime Surveys', 'CPX Research', 'Adscend Media Surveys', 'BitLabs', 'inBrain', 'Pollfish', 'TheoremReach', 'Your-Surveys',
    'Torox', 'Adscend Media', 'AdToWall', 'RevU', 'AdGate Media', 'MyChips', 'MM Wall', 'Aye-T Studios',
    'Monlix', 'Hang My Ads', 'Lootably', 'Time Wall', 'AdGem'
  ]);
  
  const isDedicatedView = dedicatedPageNames.has(page);
  
  const switchToSignup = () => {
      setIsSigninModalOpen(false);
      setIsSignupModalOpen(true);
  };

  const switchToSignin = () => {
      setIsSignupModalOpen(false);
      setIsSigninModalOpen(true);
  };

  if (isDedicatedView) {
      const ComponentToRender = pageComponentsMap[page];
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

    if (page === 'Home') {
        componentToRender = isLoggedIn ? <LoggedInHomePage /> : <HomePageContent />;
    } else {
        componentToRender = pageComponentsMap[page];
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