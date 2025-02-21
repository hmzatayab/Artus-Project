import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import * as Auction from "../Controllers/auction.controllers";

const router = Router();

router.post("/create", authMiddleware, Auction.createAuctionController); // Create an auction
router.post("/bid/:auctionId", authMiddleware, Auction.placeBid); // Place a bid
router.get("/active", Auction.getActiveAuctions); // Get all active auctions
router.get("/:auctionId", authMiddleware, Auction.getAuctionDetails); // Get auction details
router.post("/end/:auctionId", authMiddleware, Auction.endAuction); // End an auction
router.get("/user/austions", authMiddleware, Auction.userAuction); // Get User auction

export default router;
