import prisma from "../config/DB";

export const depositFunds = async (userId: string, amount: number) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) throw new Error("Wallet not found");

  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      balance: { increment: amount },
      transactions: {
        create: {
          type: "deposit",
          amount,
          status: "success",
        },
      },
    },
  });

  return updatedWallet;
};

export const withdrawFunds = async (userId: string, amount: number) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) throw new Error("Wallet not found");
  if (wallet.balance < amount) throw new Error("Insufficient funds");

  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      balance: { decrement: amount },
      transactions: {
        create: {
          type: "withdraw",
          amount,
          status: "success",
        },
      },
    },
  });

  return updatedWallet;
};

export const transferFunds = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  if (senderId === receiverId)
    throw new Error("Cannot transfer funds to yourself");
  const senderWallet = await prisma.wallet.findUnique({
    where: { userId: senderId },
  });
  const receiverWallet = await prisma.wallet.findUnique({
    where: { userId: receiverId },
  });

  if (!senderWallet || !receiverWallet) throw new Error("Wallet not found");
  if (senderWallet.balance < amount) throw new Error("Insufficient funds");

  const transfer = await prisma.$transaction([
    prisma.wallet.update({
      where: { userId: senderId },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: {
            type: "transfer",
            amount,
            toUserId: receiverId,
            status: "success",
          },
        },
      },
    }),
    prisma.wallet.update({
      where: { userId: receiverId },
      data: {
        balance: { increment: amount },
        transactions: {
          create: {
            type: "transfer",
            amount,
            fromUserId: senderId,
            status: "success",
          },
        },
      },
    }),
  ]);

  return transfer;
};

export const getWalletBalance = async (userId: string) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: { balance: true },
  });

  if (!wallet) throw new Error("Wallet not found");
  return wallet.balance;
};

export const getWalletTransactions = async (userId: string) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: { transactions: true },
  });

  if (!wallet) throw new Error("Wallet not found");
  return wallet.transactions;
};

export const getTransactionInvoice = async (transactionId: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) throw new Error("Transaction not found");
  return transaction;
};
