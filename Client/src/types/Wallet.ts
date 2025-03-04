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
    };
  };
  