import { Comment, ReplyType } from "@/Types/Comment";
import { Notification } from "@/Types/Notification";
import { Post } from "@/Types/Post";
import { Wallet } from "@/Types/Wallet";

export interface User {
  id: string;
  userId: string;
  username?: string;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  image: string;
  followers: string[];
  following: string[];
  bio: string;
  totalImagesSold: number;
  totalEarnings: number;
  totalEntryFeesPaid: number;
  prizePoolEarnings: number;
  totalAuctionsParticipated: number;
  exclusiveBadges: string[];
  totalAuctionsWon: number;
  wonPosts: string[];
  featuredInTopAuctions: boolean;
  bidCount: number;
  vipTier: string;
  freeBids: number;
  auctionFeeDiscount: number;
  exclusiveAccess: boolean;
  referralCode: string;
  referredBy: string[];
  isLive: boolean;
  walletIsActive: boolean;
  emailVerified: boolean;
  isBlocked: boolean;
  wallet?: Wallet;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
  identityVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  posts: Post[];
  comments: Comment[];
  replies: ReplyType[];
  // auctions: Auction[];
  // highestBids: Auction[];
  // wonAuctions: Auction[];
  receivedNotifications: Notification[];
  sentNotifications: Notification[];
  // Bid: Bid[];
}

export interface UserCardProps {
  user: {
    username: string;
    name: string;
    avatar: string;
    bio?: string;
    posts: number;
    followers: number;
    likes: number;
    earnings?: string;
  };
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export interface FollowButtonProps {
  userId: string;
  token: string;
  initialFollowersCount: number;
  isFollowingInitially: boolean;
}