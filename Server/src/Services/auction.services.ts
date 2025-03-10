import Redis from "../config/redis";
<<<<<<< HEAD
import cron from "node-cron";
=======
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
import prisma from "../config/DB";
import { generateInvoiceId, generateTransactionId } from "../utils/generateId";
import { AppError } from "../Types/Error";

// Schedule a cron job to check for expired auctions every hour
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Checking for expired auctions and eligible posts...");

    // 1. Check for expired auctions
    const expiredAuctions = await prisma.auction.findMany({
      where: {
        status: "active",
        endTime: { lte: new Date() },
      },
      select: { id: true },
    });

    if (expiredAuctions.length > 0) {
      await Promise.all(
        expiredAuctions.map((auction) => completeAuction(auction.id))
      );

      await prisma.auction.updateMany({
        where: { id: { in: expiredAuctions.map((auction) => auction.id) } },
        data: { status: "completed" },
      });

      console.log(`${expiredAuctions.length} auctions completed.`);
    }

    // 2. Check for posts eligible for auction
    const posts = await prisma.post.findMany({
      where: {
        eligibleForAuction: false, // Only check posts that are not already eligible
        isAuctioned: false, // Only check posts that are not already auctioned
      },
      include: {
        comments: true,
      },
    });

    const eligiblePosts = posts.filter((post) => {
      const likesCount = post.likes.length;
      const commentsCount = post.comments.length;
      return likesCount >= 1 && commentsCount >= 1; // Eligibility criteria
    });

    if (eligiblePosts.length > 0) {
      await prisma.post.updateMany({
        where: { id: { in: eligiblePosts.map((post) => post.id) } },
        data: { eligibleForAuction: true },
      });

      console.log(
        `${eligiblePosts.length} posts marked as eligible for auction.`
      );
    }
  } catch (error) {
    const err = error as AppError;
    console.error(`Error in cron job: ${err.message}`);
  }
});

export const createAuction = async (
  postId: string,
  startingPrice: number,
  sellerId: string,
  auctionDays: number
) => {
<<<<<<< HEAD
  try {
    await Redis.del(`post:${postId}`);
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { user: true },
    });
=======
  await Redis.del(`post:${postId}`);
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    include: { user: true },
  });
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)

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
        type: "Create Auction",
        status: "completed",
        transactionId: generateTransactionId(),
        invoiceId: generateInvoiceId(),
      },
    });

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + auctionDays);

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
    return newAuction;
  } catch (error) {
    const err = error as AppError;
    throw new Error(`Failed to create auction: ${err.message}`);
  }
<<<<<<< HEAD
=======

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
  setTimeout(() => completeAuction(newAuction.id), 4 * 60 * 1000);
  return newAuction;
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
};

export const completeAuction = async (auctionId: string) => {
  try {
    const admin = await prisma.admin.findFirst({ where: { role: "Admin" } });

    // Fetch the auction with the highest bid
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: { orderBy: { amount: "desc" } },
        post: true,
        seller: true,
      },
    });

    if (!auction || auction.status !== "active") {
      console.log(`Auction ${auctionId} already completed or invalid.`);
      return;
    }

    const highestBid = auction.bids[0] || null;
    const winnerId = highestBid?.userId ?? "";
    const totalAmount = highestBid?.amount || 0;

    // If no bids, mark the auction as completed without a winner
    if (!highestBid) {
      console.log(`Auction ${auctionId} ended with no bids.`);
      await prisma.auction.update({
        where: { id: auctionId },
        data: { status: "completed", winnerId: null },
      });
      await prisma.post.update({
        where: { id: auction.postId },
        data: { OwnerId: null, isAuctioned: false },
      });
      return;
    }

    // Calculate commission (5%) and seller amount (95%)
    const commission = totalAmount * 0.05;
    const sellerAmount = totalAmount - commission;

    const totalBidsCount = auction.bids.length;
    const giftAmountPerBid = 1;
    const totalGiftAmount = totalBidsCount * giftAmountPerBid;

    await prisma.wallet.update({
      where: { userId: winnerId },
      data: { balance: { increment: totalGiftAmount } },
    });

    // Create a transaction record for the gift amount
    await prisma.transaction.create({
      data: {
        walletId: winnerId,
        amount: totalGiftAmount,
        type: "Gift",
        status: "completed",
        transactionId: generateTransactionId(),
        invoiceId: generateInvoiceId(),
      },
    });

    // Notify the winner about the gift
    await prisma.notification.create({
      data: {
        receiverId: winnerId,
        senderId: admin?.id ?? "",
        type: "auction",
        link: `/auction/${auction.id}`,
        message: `Congratulations! You won the auction for post "${auction.post.title}". You received a gift of $${totalGiftAmount} for ${totalBidsCount} bids.`,
        isRead: false,
      },
    });

    // Update auction status and winner
    await prisma.auction.update({
      where: { id: auctionId },
      data: { status: "completed", winnerId },
    });

<<<<<<< HEAD
    // Transfer ownership of the post to the winner
    await prisma.post.update({
      where: { id: auction.postId },
      data: { OwnerId: winnerId, isAuctioned: false },
    });
=======
    if (winnerId) {
      await prisma.post.update({
        where: { id: auction.postId },
        data: { 
          OwnerId: winnerId, 
          isAuctioned: false 
        },
      });
      
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)

    // Update wallets (admin commission and seller amount)
    await Promise.all([
      prisma.wallet.update({
        where: { userId: admin?.id },
        data: { balance: { increment: commission } },
      }),
      prisma.wallet.update({
        where: { userId: auction.sellerId },
        data: { balance: { increment: sellerAmount } },
      }),
    ]);

    // Notify the winner
    if (winnerId) {
      await prisma.notification.create({
        data: {
          receiverId: winnerId,
          senderId: admin?.id ?? "",
          type: "auction",
          link: `/auction/${auction.id}`,
          message: `Congratulations! You won the auction for post "${auction.post.title}". Check your profile.`,
          isRead: false,
        },
      });
    }

    // Notify all bidders about the auction result
    await Promise.all(
      auction.bids.map((bid) =>
        prisma.notification.create({
          data: {
            receiverId: bid.userId,
            senderId: auction.sellerId,
            type: "auction",
            link: `/auction/${auction.id}`,
            message: `The auction for post "${
              auction.post.title
            }" has ended. The winner is ${
              winnerId ? "User " + winnerId : "No one"
            }.`,
            isRead: false,
          },
        })
      )
    );

    console.log(
      `Auction ${auctionId} completed. Winner: ${winnerId || "No one"}`
    );
  } catch (error) {
    console.error(`Failed to complete auction ${auctionId}:`, error);
    throw error;
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
        type: "Bid",
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
        type: "Bid Fee",
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
    console.error(error);
<<<<<<< HEAD
    throw new Error(
      error instanceof Error ? error.message : "Failed to place bid"
    );
=======
    throw new Error(error instanceof Error ? error.message : "Failed to place bid");
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
  }
};

export const endAuction = async (
  auctionId: string,
  userId: string,
  postId: string
) => {
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

    await prisma.post.update({
      where: { id: postId },
      data: { isAuctioned: false, OwnerId: null },
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
