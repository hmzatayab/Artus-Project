import prisma from "../config/DB";
import { Request, Response } from "express";
import * as Auction from "../Services/auction.services";
import { AppError } from "../Types/Error";

export const createAuctionController = async (req: Request, res: Response) => {
  try {
    const { post, startingPrice, auctionDays } = req.body;
    const sellerId = (req as any).user?.userId;

    if (!sellerId) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const auction = await Auction.createAuction(
      post,
      startingPrice,
      sellerId,
      auctionDays
    );

    res.status(201).json({
      message: "Auction created successfully, and amount deducted from wallet",
      auction,
    });
  } catch (error) {
    const err = error as AppError
    res.status(500).json({ message: err.message, susscces: false });
  }
};

export const placeBid = async (req: Request, res: Response) => {
  const { auctionId } = req.params;
  const { bidAmount } = req.body;
  const bidderId = (req as any).user?.userId;

  if (!bidderId) {
    res.status(401).json({ message: "Unauthorized: User not found" });
    return;
  }

  try {
    const result = await Auction.placeBid(auctionId, bidderId, bidAmount);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Server error" });
  }
};

export const getActiveAuctions = async (req: Request, res: Response) => {
  try {
    const activeAuctions = await prisma.auction.findMany({
      where: { status: "active" },
      include: {
        bids: true,
        seller: { select: { id: true, name: true } },
        highestBidder: { select: { id: true, name: true } },
        winner: { select: { id: true, name: true } },
      },
    });

    if (!activeAuctions || activeAuctions.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "No active auctions found" });
      return;
    }

    res.status(200).json({ success: true, auctions: activeAuctions });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuctionDetails = async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;

    if (!auctionId || auctionId.length !== 24) {
      res.status(400).json({ success: false, message: "Invalid Auction ID" });
      return;
    }

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        seller: { select: { id: true, name: true, email: true, identityVerified: true, username: true } },
        highestBidder: {
          select: { id: true, name: true, email: true, image: true, identityVerified: true, username: true },
        },
        winner: { select: { id: true, name: true, email: true, identityVerified: true, username: true } },
        bids: {
          include: { user: { select: { id: true, name: true, image: true, identityVerified: true, username: true } } },
        },
        post: {
          select: { id: true, title: true, description: true, imageURL: true },
        },
      },
    });

    if (!auction) {
      res.status(404).json({ success: false, message: "Auction not found" });
      return;
    }

    res.status(200).json({ success: true, auction });
  } catch (error: any) {
    console.error("Error fetching auction details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const endAuction = async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    const { postId } = req.body;
    const userId = (req as any).user?.userId;

    const auction = await Auction.endAuction(auctionId, userId, postId);

    res.status(200).json({
      success: true,
      message: "Auction ended successfully",
      auction,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const userAuction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const auctions = await prisma.auction.findMany({
      where: { sellerId: userId },
      include: {
        highestBidder: { select: { name: true, image: true } },
        winner: { select: { name: true, image: true } },
        post: true,
      },
    });
    if (!auctions.length) {
      res
        .status(404)
        .json({ success: false, message: "No auctions found for this user" });
      return;
    }

    res.status(200).json({ success: true, auctions });
  } catch (error) {
    console.error("Error fetching user auctions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
