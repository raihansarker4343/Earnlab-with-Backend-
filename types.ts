// FIX: Import `ReactNode` to resolve 'Cannot find namespace 'React'' error.
import type { ReactNode } from 'react';

export interface User {
  username: string;
  avatarUrl: string;
  joinedDate: string;
  id: string;
  earnId: string;
  rank: string;
  xp: number;
  xpToNextLevel: number;
  totalEarned: number;
  last30DaysEarned: number;
  completedTasks: number;
  totalWagered: number;
  totalProfit: number;
  totalWithdrawn: number;
  totalReferrals: number;
  referralEarnings: number;
  referralLink: string;
}

export interface EarningFeedItem {
  id: number;
  user: string;
  avatar: string;
  task: string;
  provider: string;
  amount: number;
}

export interface SurveyProvider {
  name: string;
  logo: string;
  type?: string;
  rating?: number;
  isSpecial?: boolean;
  isLocked?: boolean;
  unlocksAt?: string;
  unlockRequirement?: string;
}

export interface OfferWall {
  name: string;
  logo: string;
  bonus?: string;
  isLocked?: boolean;
  unlockRequirement?: string;
}

export interface SidebarMenuItem {
  name: string;
  icon: ReactNode;
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

export interface Transaction {
  id: string;
  type: 'Withdrawal' | 'Deposit' | 'Task Reward';
  method: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}