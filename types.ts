// FIX: Changed to a full React import to ensure proper type resolution.
import React from 'react';

export interface User {
  id: string | number;
  username: string;
  email?: string;
  avatarUrl?: string;
  joinedDate?: string;
  earnId?: string;
  rank?: string;
  xp?: number;
  xpToNextLevel?: number;
  totalEarned?: number;
  balance?: number;
  last30DaysEarned?: number;
  completedTasks?: number;
  totalWagered?: number;
  totalProfit?: number;
  totalWithdrawn?: number;
  totalReferrals?: number;
  referralEarnings?: number;
}

export interface EarningFeedItem {
  id: string;
  user: string;
  avatar: string;
  task: string;
  provider: string;
  amount: number;
}

export interface SurveyProvider {
  id: number;
  name: string;
  logo: string;
  type?: string;
  rating?: number;
  isSpecial?: boolean;
  isLocked?: boolean;
  unlocksAt?: string;
  unlockRequirement?: string;
  isEnabled: boolean;
}

export interface OfferWall {
  id: number;
  name: string;
  logo: string;
  bonus?: string;
  isLocked?: boolean;
  unlockRequirement?: string;
  isEnabled: boolean;
}

export interface SidebarMenuItem {
  name: string;
  icon: React.ReactNode;
  isHot?: boolean;
  isSpecial?: boolean;
  action?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RewardOption {
  name: string;
  logo: string;
  bgColor: string;
}

export interface LeaderboardUser {
  rank: number;
  user: string;
  avatar: string;
  earned: number;
  level: number;
}

export interface Achievement {
  id: number;
  icon: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  goal: number;
}

export interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  isSelf: boolean;
}

export interface Testimonial {
  text: string;
  author: string;
  rating: number;
}

export interface FeaturedOffer {
  logo: string;
  name: string;
  description: string;
  payout: number;
  rating: number;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkTo?: string;
}

export interface Transaction {
  id: string;
  type: 'Withdrawal' | 'Deposit' | 'Task Reward';
  method: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Rejected';
  date: string;
  source?: 'Task' | 'Survey' | 'Offer';
  // FIX: Added `userId` to the Transaction type to resolve an error in `AdminDashboardPage.tsx`.
  // The backend includes this field, so it's necessary for logic involving user identification.
  userId: number;
  email?: string;
}

export interface PaymentMethod {
    id: number;
    name: string;
    iconClass: string;
    type: 'special' | 'cash' | 'crypto';
    isEnabled: boolean;
    specialBonus?: string | null;
}

export const AppContext = React.createContext<{
  isLoggedIn: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  handleLogin: (token: string) => Promise<void>;
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
  isWithdrawSuccessModalOpen: boolean;
  setIsWithdrawSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileEditModalOpen: boolean;
  setIsProfileEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  notifications: [],
  setNotifications: () => {},
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
  isWithdrawSuccessModalOpen: false,
  setIsWithdrawSuccessModalOpen: () => {},
  isProfileEditModalOpen: false,
  setIsProfileEditModalOpen: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});
