export type Transaction = {
    id: string;
    walletId: string;
    type: string;
    amount: number;
    transactionId: string;
    invoiceId: string;
    fromUserId: string | null;
    toUserId: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    fromUser: {
      id: string;
      name: string | null;
      username: string | null;
      image: string | null;
    } | null;
    toUser: {
      id: string;
      name: string | null;
      username: string | null;
      image: string | null;
    } | null;
    // Additional fields (if any)
    failedTransactionCount?: number;
    lastFailedTransactionTime?: Date | null;
  };
  
  // User Type for fromUser & toUser
  export type User = {
    id: string;
    name: string;
    username: string;
    image?: string; // Optional, because some users may not have an image
  };
  
  // Wallet Type including Transactions
  export type Wallet = {
    wallet: {
      id: string;
      userId: string;
      balance: number;
      walletId: string;
      isActive: boolean;
      cashbackBalance: number;
      totalCashbackEarned: number;
      usedCashback: number;
      createdAt: string; // ISO Date String
      updatedAt: string; // ISO Date String
      failedTransactionCount: number;
      lastFailedTransactionTime: string | null;
      transactions: Transaction[]; // Array of transactions
    };
  };
  