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

export type Transaction = {
  id: string;
  walletId: string;
  type: "deposit" | "withdrawal" | "transfer"; // Adjust types as needed
  amount: number;
  transactionId: string;
  invoiceId: string;
  fromUserId: string | null;
  toUserId: string | null;
  status: "success" | "pending" | "failed"; // Add more statuses if needed
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
};

export type TransactionsResponse = {
  success: boolean;
  transactions: Transaction[];
};
