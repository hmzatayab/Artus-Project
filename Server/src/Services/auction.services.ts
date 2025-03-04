import prisma from "../config/DB";
import { generateInvoiceId, generateTransactionId } from "../utils/generateId";

export const createAuction = async (
  postId: string,
  startingPrice: number,
  sellerId: string
) => {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    include: { user: true },
  });

  if (!existingPost || existingPost.userId !== sellerId) {
    throw new Error("You can only create an auction for your own post");
  }

  const commentsCount = await prisma.comment.count({ where: { postId } });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { likes: true },
  });
  const likesCount = post?.likes.length || 0;

  if (likesCount < 0 || commentsCount < 0) {
    throw new Error(
      "You need at least 5 likes and 1 comment to start an auction"
    );
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: sellerId },
  });

  if (!wallet || !wallet.isActive) {
    throw new Error("Wallet is inactive. Cannot start auction.");
  }

  if (wallet.balance < startingPrice) {
    throw new Error("Insufficient balance to start auction.");
  }

  const updatedWallet = await prisma.wallet.update({
    where: { userId: sellerId },
    data: { balance: { decrement: startingPrice } },
  });

  await prisma.transaction.create({
    data: {
      walletId: updatedWallet.id,
      amount: startingPrice,
      type: "First Bid",
      status: "completed",
      transactionId: generateTransactionId(),
      invoiceId: generateInvoiceId(),
    },
  });

  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 2);

  const newAuction = await prisma.auction.create({
    data: {
      postId,
      sellerId,
      startingPrice,
      status: "active",
      endTime,
    },
  });

  await prisma.post.update({
    where: { id: postId },
    data: { isAuctioned: true, auctionId: newAuction.id, OwnerId: null },
  });

  await prisma.notification.create({
    data: {
      receiverId: sellerId,
      senderId: sellerId,
      type: "auction",
      link: `/auction/${newAuction.id}`,
      message: `Your auction has been created successfully, and $${startingPrice} has been deducted from your wallet.`,
      isRead: false,
    },
  });
  setTimeout(() => completeAuction(newAuction.id), 2 * 60 * 1000);
  return newAuction;
};

export const completeAuction = async (auctionId: string) => {
  try {
    const admin = await prisma.admin.findFirst({
      where: { role: "Admin" },
    });

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { amount: "desc" } } }, // Highest bid first
    });

    if (!auction || auction.status !== "active") {
      console.log(`Auction ${auctionId} already completed or invalid.`);
      return;
    }

    const highestBid = auction.bids.length > 0 ? auction.bids[0] : null;
    const winnerId = highestBid ? highestBid.userId : null;
    const totalAmount = highestBid ? highestBid.amount : 0;

    if (!highestBid) {
      console.log(`Auction ${auctionId} ended with no bids.`);
      await prisma.auction.update({
        where: { id: auctionId },
        data: { status: "completed", winnerId: null },
      });
      return;
    }

    // 💰 Calculate Commission (5%) and Seller Amount (95%)
    const commission = totalAmount * 0.05;
    const sellerAmount = totalAmount - commission;

    await prisma.auction.update({
      where: { id: auctionId },
      data: { status: "completed", winnerId },
    });

    if (winnerId) {
      await prisma.post.update({
        where: { id: auction.postId },
        data: { OwnerId: winnerId },
      });

      await prisma.wallet.update({
        where: { userId: admin?.id }, // Replace with actual admin wallet ID
        data: { balance: { increment: commission } },
      });

      await prisma.wallet.update({
        where: { userId: auction.sellerId },
        data: { balance: { increment: sellerAmount } },
      });

      await prisma.notification.create({
        data: {
          receiverId: winnerId,
          senderId: admin?.id ?? "",
          type: "auction",
          link: `/auction/${auction.id}`,
          message: `Congratulations! You won the auction for post ${auction.postId}. Check your profile.`,
          isRead: false,
        },
      });
    }

    for (const bid of auction.bids) {
      await prisma.notification.create({
        data: {
          receiverId: bid.userId,
          senderId: auction.sellerId,
          type: "auction",
          link: `/auction/${auction.id}`,
          message: `The auction has ended. The winner is ${
            winnerId ? "User " + winnerId : "No one"
          }.`,
          isRead: false,
        },
      });
    }

    console.log(
      `Auction ${auctionId} completed. Winner: ${winnerId || "No one"}`
    );
  } catch (error) {
    console.error("Failed to complete auction:", error);
  }
};

export const placeBid = async (
  auctionId: string,
  bidderId: string,
  bidAmount: number
) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });
    const wallet = await prisma.wallet.findUnique({
      where: { userId: bidderId },
    });

    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "active") throw new Error("Auction is not active");
    if (bidAmount <= (auction.highestBid || 0))
      throw new Error("Bid must be higher than the current highest bid");
    if (auction.sellerId === bidderId)
      throw new Error("You cannot bid on your own auction");
    if (!wallet || !wallet.isActive) throw new Error("Wallet is inactive");
    if (wallet.balance < bidAmount + 1)
      throw new Error("Insufficient balance (including bid fee)");

    if (auction.highestBidderId) {
      const prevBidderWallet = await prisma.wallet.findUnique({
        where: { userId: auction.highestBidderId },
      });
      if (prevBidderWallet) {
        await prisma.wallet.update({
          where: { userId: auction.highestBidderId },
          data: { balance: { increment: auction.highestBid } },
        });
        await prisma.transaction.create({
          data: {
            walletId: prevBidderWallet.id,
            amount: auction.highestBid,
            type: "refund",
            status: "completed",
            transactionId: generateTransactionId(),
            invoiceId: generateInvoiceId(),
          },
        });
      }
    }

    // Deduct bid amount and bid fee ($1)
    await prisma.wallet.update({
      where: { userId: bidderId },
      data: { balance: { decrement: bidAmount + 1 } },
    });

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: bidAmount,
        type: "bid",
        status: "completed",
        transactionId: generateTransactionId(),
        invoiceId: generateInvoiceId(),
      },
    });

    // Record bid fee deduction (system keeps it, no refund)
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: 1,
        type: "bid_fee",
        status: "completed",
        transactionId: generateTransactionId(),
        invoiceId: generateInvoiceId(),
      },
    });

    await prisma.auction.update({
      where: { id: auctionId },
      data: {
        highestBid: bidAmount,
        highestBidderId: bidderId,
        bids: { create: { userId: bidderId, amount: bidAmount } },
      },
    });

    // Notify bidder about bid and fee deduction
    await prisma.notification.create({
      data: {
        receiverId: bidderId,
        senderId: auction.sellerId,
        type: "auction",
        link: `/auction/${auction.id}`,
        message: `You placed a bid of $${bidAmount}. A $1 bid fee has been deducted from your wallet.`,
        isRead: false,
      },
    });

    return { success: true, message: "Bid placed successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const endAuction = async (auctionId: string, userId: string) => {
  // Check if auction exists
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: { highestBidder: true }, // Include highest bidder details
  });
  const admin = await prisma.admin.findFirst({
    where: { role: "Admin" },
  });

  if (!auction) {
    throw new Error("Auction not found");
  }

  // Check if the logged-in user is the auction creator
  if (auction.sellerId !== userId) {
    throw new Error("You can only end your own auctions");
  }

  // If there's a highest bidder, process refund + bonus
  if (auction.highestBidderId) {
    const highestBidAmount = auction.highestBid;
    const bonusAmount = highestBidAmount * 0.05; // 5% bonus
    const totalAmount = highestBidAmount + bonusAmount; // Total amount after bonus

    const artusCommission = totalAmount * 0.02; // 2% Artus commission
    const finalAmountForBidder = totalAmount - artusCommission; // Remaining amount for bidder

    // 🛑 Cut 5% bonus amount from auction creator's wallet
    await prisma.wallet.update({
      where: { userId: auction.sellerId }, // Auction creator's wallet
      data: { balance: { decrement: bonusAmount } },
    });

    // ✅ Update highest bidder's wallet (after Artus commission)
    const updatedBidderWallet = await prisma.wallet.update({
      where: { userId: auction.highestBidderId },
      data: { balance: { increment: finalAmountForBidder } },
    });

    // ✅ Create transaction for highest bidder
    await prisma.transaction.create({
      data: {
        walletId: updatedBidderWallet.id,
        amount: finalAmountForBidder,
        type: "bonus",
        status: "completed",
        transactionId: generateTransactionId(),
        invoiceId: generateInvoiceId(),
      },
    });

    // ✅ Create notification for highest bidder
    await prisma.notification.create({
      data: {
        receiverId: auction.highestBidderId,
        senderId: auction.sellerId,
        type: "auction",
        link: `/auction/${auction.id}`,
        message: `The auction for post ${auction.postId} was ended by the seller. As a participant, you received a 3% bonus.`,
        isRead: false,
      },
    });

    // ✅ Transfer Artus commission to admin's wallet
    await prisma.wallet.update({
      where: { userId: admin?.id }, // Replace with actual admin ID
      data: { balance: { increment: artusCommission } },
    });
  }

  // Mark auction as "ended"
  const updatedAuction = await prisma.auction.update({
    where: { id: auctionId },
    data: { status: "ended" },
  });

  return updatedAuction;
};
