// auctionController.ts
import { Request, Response } from "express";
import * as Auction from "../Services/auction.services";

export const createAuctionController = async (req: Request, res: Response) => {
  try {
    const { post, startingPrice } = req.body;
    const sellerId = (req as any).user?.userId;

    if (!sellerId) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const auction = await Auction.createAuction(post, startingPrice, sellerId);

    res.status(201).json({
      message: "Auction created successfully, and amount deducted from wallet",
      auction,
    });
  } catch (error) {
    console.error("Error in createAuctionController:", error);
    res.status(500).json({ message: error });
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
