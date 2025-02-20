import prisma from "../config/DB";

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

  const transactionIdGen = Math.floor(
    100000000000 + Math.random() * 900000000000
  ).toString();
  const InvoiceIdGen = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.transaction.create({
    data: {
      walletId: updatedWallet.id,
      amount: startingPrice,
      type: "Bid",
      status: "completed",
      transactionId: transactionIdGen,
      invoiceId: InvoiceIdGen,
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
    data: { isAuctioned: true, auctionId: newAuction.id, winnerId: null },
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
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { amount: "desc" } } }, // Highest bid first
    });

    if (!auction || auction.status !== "active") {
      console.log(`Auction ${auctionId} already completed or invalid.`);
      return;
    }

    // 🏆 Find the highest bidder
    const highestBid = auction.bids.length > 0 ? auction.bids[0] : null;
    const winnerId = highestBid ? highestBid.userId : null;

    // 📌 Update Auction Status
    await prisma.auction.update({
      where: { id: auctionId },
      data: { status: "completed", winnerId },
    });

    // 📌 Update Post with Winner
    if (winnerId) {
      await prisma.post.update({
        where: { id: auction.postId },
        data: { winnerId },
      });

      // 🛑 Notify Winner
      await prisma.notification.create({
        data: {
          receiverId: winnerId,
          senderId: auction.sellerId,
          type: "auction",
          link: `/auction/${auction.id}`,
          message: `Congratulations! You won the auction for post ${auction.postId}. Check your profile.`,
          isRead: false,
        },
      });
    }

    // 🔔 Notify All Bidders
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
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "active") throw new Error("Auction is not active");
    if (bidAmount <= (auction.highestBid || 0))
      throw new Error("Bid must be higher than the current highest bid");

    const wallet = await prisma.wallet.findUnique({
      where: { userId: bidderId },
    });
    if (!wallet || !wallet.isActive) throw new Error("Wallet is inactive");
    if (wallet.balance < bidAmount) throw new Error("Insufficient balance");

    if (auction.highestBidderId) {
      const prevBidderWallet = await prisma.wallet.findUnique({
        where: { userId: auction.highestBidderId },
      });
      if (prevBidderWallet) {
        await prisma.wallet.update({
          where: { userId: auction.highestBidderId },
          data: { balance: { increment: auction.highestBid } },
        });
        const transactionIdGen = Math.floor(
          100000000000 + Math.random() * 900000000000
        ).toString();
        const InvoiceIdGen = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        await prisma.transaction.create({
          data: {
            walletId: prevBidderWallet.id,
            amount: auction.highestBid,
            type: "refund",
            status: "completed",
            transactionId: transactionIdGen,
            invoiceId: InvoiceIdGen,
          },
        });
      }
    }

    await prisma.wallet.update({
      where: { userId: bidderId },
      data: { balance: { decrement: bidAmount } },
    });

    const transactionIdGen = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();
    const InvoiceIdGen = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: bidAmount,
        type: "bid",
        status: "completed",
        transactionId: transactionIdGen,
        invoiceId: InvoiceIdGen,
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
    return { success: true, message: "Bid placed successfully" };
  } catch (error) {
    console.log(error);
  }
};
