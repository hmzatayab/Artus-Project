import prisma from "../config/DB";
import { generateRandomId } from "../utils/generateId";

export const depositFunds = async (userId: string, amount: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!user) throw new Error("User not found");
  if (!user.isEmailVerified)
    throw new Error("Email not verified. Please verify your email first.");
  if (!wallet?.isActive)
    throw new Error("Transaction failed because your wallet is not active.");
  if (user.isBlocked)
    throw new Error("Your account is blocked. Please contact support.");

  if (!wallet) throw new Error("Wallet not found");

  const failedTransactions = await prisma.transaction.findMany({
    where: {
      walletId: wallet.id,
      status: "failed",
      createdAt: {
        gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  if (failedTransactions.length >= 5) {
    await prisma.wallet.update({
      where: { id: userId },
      data: { isActive: false },
    });

    throw new Error(
      "Your wallet is temporarily blocked due to repeated failed transactions. Please try again later."
    );
  }

  let updatedWallet;
  try {
    updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        balance: { increment: amount },
        transactions: {
          create: {
            type: "deposit",
            amount,
            status: "success",
            transactionId: generateRandomId(12),
            invoiceId: generateRandomId(6),
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        receiverId: userId,
        senderId: userId,
        type: "deposit",
        message: `Your deposit of ${amount} was successful.`,
        link: `/wallet/${wallet.id}`,
        isRead: false,
      },
    });
  } catch (error) {
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "deposit",
        amount,
        status: "failed",
        transactionId: generateRandomId(12),
        invoiceId: generateRandomId(6),
      },
    });

    await prisma.wallet.update({
      where: { userId },
      data: {
        failedTransactionCount: { increment: 1 },
        lastFailedTransactionTime: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        receiverId: userId,
        senderId: userId,
        type: "deposit",
        message: `Your deposit of ${amount} failed. Please try again.`,
        link: `/wallet/${wallet.id}`,
        isRead: false,
      },
    });

    throw new Error("Transaction failed. Please try again.");
  }

  return updatedWallet;
};

export const withdrawFunds = async (userId: string, amount: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!user) throw new Error("User not found");
  if (!user.isEmailVerified)
    throw new Error("Email not verified. Please verify your email first.");
  if (!wallet?.isActive)
    throw new Error("Transaction failed because your wallet is not active.");
  if (user.isBlocked)
    throw new Error("Your account is blocked. Please contact support.");

  if (!wallet) throw new Error("Wallet not found");

  const failedTransactions = await prisma.transaction.findMany({
    where: {
      walletId: wallet.id,
      status: "failed",
      createdAt: {
        gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  if (failedTransactions.length >= 5) {
    await prisma.wallet.update({
      where: { id: userId },
      data: { isActive: false },
    });

    throw new Error(
      "Your wallet is temporarily blocked due to repeated failed transactions. Please try again later."
    );
  }

  if (wallet.balance < amount) {
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "withdraw",
        amount,
        status: "failed",
        transactionId: generateRandomId(12),
        invoiceId: generateRandomId(6),
      },
    });

    await prisma.notification.create({
      data: {
        receiverId: userId,
        senderId: userId,
        type: "withdraw",
        message: `Withdrawal failed due to insufficient funds.`,
        link: `/wallet/${wallet.id}`,
        isRead: false,
      },
    });

    await prisma.wallet.update({
      where: { userId },
      data: {
        failedTransactionCount: { increment: 1 },
        lastFailedTransactionTime: new Date(),
      },
    });

    throw new Error("Insufficient funds. Transaction failed.");
  }

  let updatedWallet;
  try {
    updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: {
            type: "withdraw",
            amount,
            status: "success",
            transactionId: generateRandomId(12),
            invoiceId: generateRandomId(6),
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        receiverId: userId,
        senderId: userId,
        type: "withdraw",
        message: `Withdrawal of ${amount} was successful.`,
        link: `/wallet/${wallet.id}`,
        isRead: false,
      },
    });
  } catch (error) {
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "withdraw",
        amount,
        status: "failed",
        transactionId: generateRandomId(12),
        invoiceId: generateRandomId(6),
      },
    });

    await prisma.wallet.update({
      where: { userId },
      data: {
        failedTransactionCount: { increment: 1 },
        lastFailedTransactionTime: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        receiverId: userId,
        senderId: userId,
        type: "withdraw",
        message: `Withdrawal of ${amount} failed. Please try again.`,
        link: `/wallet/${wallet.id}`,
        isRead: false,
      },
    });

    throw new Error("Transaction failed. Please try again.");
  }

  return updatedWallet;
};

export const transferFunds = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  const sender = await prisma.user.findUnique({
    where: { id: senderId },
  });
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  const senderWallet = await prisma.wallet.findUnique({
    where: { userId: senderId },
  });
  const receiverWallet = await prisma.wallet.findUnique({
    where: { userId: receiverId },
  });

  if (!sender || !receiver) throw new Error("User not found");
  if (!sender.isEmailVerified)
    throw new Error("Email not verified. Please verify your email first.");
  if (!receiver.isEmailVerified)
    throw new Error("Receiver Email not verified.");
  if (!senderWallet?.isActive)
    throw new Error("Transaction failed because your wallet is not active.");
  if (!receiverWallet?.isActive)
    throw new Error(
      "Transaction failed because the recipient's wallet is not active."
    );
  if (sender.isBlocked)
    throw new Error("Your account is blocked. Please contact support.");
  if (receiver.isBlocked) throw new Error("Receiver account is blocked.");

  if (senderId === receiverId)
    throw new Error("Cannot transfer funds to yourself");

  if (!senderWallet || !receiverWallet) throw new Error("Wallet not found");

  const failedTransactions = await prisma.transaction.findMany({
    where: {
      walletId: senderWallet.id,
      status: "failed",
      createdAt: {
        gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  if (failedTransactions.length >= 5) {
    await prisma.wallet.update({
      where: { id: senderId },
      data: { isActive: false },
    });

    await prisma.notification.create({
      data: {
        receiverId: senderId,
        senderId: senderId,
        type: "wallet_deactivation",
        message:
          "Your wallet is temporarily blocked due to repeated failed transactions. Please try again after 24 hours.",
        link: `/wallet/${senderWallet.id}`,
        isRead: false,
      },
    });

    throw new Error(
      "Your wallet is temporarily blocked due to repeated failed transactions. Please try again after 24 hours."
    );
  }

  if (senderWallet.balance < amount) {
    await prisma.transaction.create({
      data: {
        walletId: senderWallet.id,
        type: "transfer",
        amount,
        status: "failed",
        transactionId: generateRandomId(12),
        invoiceId: generateRandomId(6),
      },
    });

    await prisma.wallet.update({
      where: { userId: senderId },
      data: {
        failedTransactionCount: { increment: 1 },
        lastFailedTransactionTime: new Date(),
      },
    });

    const failedCount = senderWallet.failedTransactionCount + 1;
    if (failedCount >= 5) {
      await prisma.wallet.update({
        where: { id: senderId },
        data: { isActive: false },
      });

      await prisma.notification.create({
        data: {
          receiverId: senderId,
          senderId: senderId,
          type: "wallet_deactivation",
          message:
            "Your wallet is temporarily blocked due to repeated failed transactions. Please try again after 24 hours.",
          link: `/wallet/${senderWallet.id}`,
          isRead: false,
        },
      });
    }

    await prisma.notification.create({
      data: {
        receiverId: senderId,
        senderId: senderId,
        type: "failed_transfer",
        message: `Transfer failed due to insufficient funds.`,
        link: `/wallet/${senderWallet.id}`,
        isRead: false,
      },
    });

    throw new Error("Insufficient funds. Transaction failed.");
  }

  await prisma.$transaction([
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
            transactionId: generateRandomId(12),
            invoiceId: generateRandomId(6),
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
            transactionId: generateRandomId(12),
            invoiceId: generateRandomId(6),
          },
        },
      },
    }),
  ]);

  await prisma.notification.create({
    data: {
      receiverId: senderId,
      senderId: senderId,
      type: "successful_transfer",
      message: `You have successfully transferred ${amount} to ${receiverId}.`,
      link: `/wallet/${senderWallet.id}`,
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      receiverId: receiverId,
      senderId: senderId,
      type: "received_transfer",
      message: `You have received ${amount} from ${senderId}.`,
      link: `/wallet/${receiverWallet.id}`,
      isRead: false,
    },
  });
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
