import prisma from "../config/DB";

export const depositFunds = async (userId: string, amount: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");
  if (!user.isEmailVerified)
    throw new Error("Email not verified. Please verify your email first.");
  if (!user.walletIsActive)
    throw new Error("Transaction failed because your wallet is not active.");
  if (user.isBlocked)
    throw new Error("Your account is blocked. Please contact support.");

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

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
    await prisma.user.update({
      where: { id: userId },
      data: { walletIsActive: false },
    });

    throw new Error(
      "Your wallet is temporarily blocked due to repeated failed transactions. Please try again later."
    );
  }

  const InvoiceIdGen = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  const transactionIdGen = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

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
            transactionId: transactionIdGen(),
            invoiceId: InvoiceIdGen(),
          },
        },
      },
    });

    // Create notification for deposit success
    await prisma.notification.create({
      data: {
        receiverId: userId,
        senderId: userId, // Self-initiated deposit
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
        transactionId: transactionIdGen(),
        invoiceId: InvoiceIdGen(),
      },
    });

    await prisma.wallet.update({
      where: { userId },
      data: {
        failedTransactionCount: { increment: 1 },
        lastFailedTransactionTime: new Date(),
      },
    });

    // Create notification for failed deposit
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

  if (!user) throw new Error("User not found");
  if (!user.isEmailVerified)
    throw new Error("Email not verified. Please verify your email first.");
  if (!user.walletIsActive)
    throw new Error("Transaction failed because your wallet is not active.");
  if (user.isBlocked)
    throw new Error("Your account is blocked. Please contact support.");

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

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
    await prisma.user.update({
      where: { id: userId },
      data: { walletIsActive: false },
    });

    throw new Error(
      "Your wallet is temporarily blocked due to repeated failed transactions. Please try again later."
    );
  }

  if (wallet.balance < amount) {
    // If insufficient funds, create a failed transaction
    const transactionIdGen = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();
    const InvoiceIdGen = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "withdraw",
        amount,
        status: "failed",
        transactionId: transactionIdGen,
        invoiceId: InvoiceIdGen,
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

  const InvoiceIdGen = Math.floor(100000 + Math.random() * 900000).toString();
  const transactionIdGen = Math.floor(
    100000000000 + Math.random() * 900000000000
  ).toString();

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
            transactionId: transactionIdGen,
            invoiceId: InvoiceIdGen,
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
        transactionId: transactionIdGen,
        invoiceId: InvoiceIdGen,
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

  if (!sender || !receiver) throw new Error("User not found");
  if (!sender.isEmailVerified)
    throw new Error("Email not verified. Please verify your email first.");
  if (!receiver.isEmailVerified)
    throw new Error("Receiver Email not verified.");
  if (!sender.walletIsActive)
    throw new Error("Transaction failed because your wallet is not active.");
  if (!receiver.walletIsActive)
    throw new Error(
      "Transaction failed because the recipient's wallet is not active."
    );
  if (sender.isBlocked)
    throw new Error("Your account is blocked. Please contact support.");
  if (receiver.isBlocked) throw new Error("Receiver account is blocked.");

  if (senderId === receiverId)
    throw new Error("Cannot transfer funds to yourself");
  const senderWallet = await prisma.wallet.findUnique({
    where: { userId: senderId },
  });
  const receiverWallet = await prisma.wallet.findUnique({
    where: { userId: receiverId },
  });

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
    await prisma.user.update({
      where: { id: senderId },
      data: { walletIsActive: false },
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
    const transactionIdGen = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();
    const InvoiceIdGen = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.transaction.create({
      data: {
        walletId: senderWallet.id,
        type: "transfer",
        amount,
        status: "failed",
        transactionId: transactionIdGen,
        invoiceId: InvoiceIdGen,
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
      await prisma.user.update({
        where: { id: senderId },
        data: { walletIsActive: false },
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

  const InvoiceIdGen = Math.floor(100000 + Math.random() * 900000).toString();
  const transactionIdGen = Math.floor(
    100000000000 + Math.random() * 900000000000
  ).toString();

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
            transactionId: transactionIdGen,
            invoiceId: InvoiceIdGen,
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
            transactionId: transactionIdGen,
            invoiceId: InvoiceIdGen,
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
