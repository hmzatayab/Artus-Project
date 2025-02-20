import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import * as Auction from "../Controllers/auction.controllers";

const router = Router();

router.post("/create", authMiddleware, Auction.createAuctionController); // Create an auction
router.post("/bid/:auctionId", authMiddleware, Auction.placeBid); // Place a bid
// router.get("/active", getActiveAuctions); // Get all active auctions
// router.get("/:auctionId", authMiddleware, getAuctionDetails); // Get auction details
// router.put("/complete/:auctionId", completeAuction); // Complete Auction Route
// router.post("/end/:auctionId", authMiddleware, endAuction); // End an auction

export default router;
