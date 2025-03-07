import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import * as walletController from "../Controllers/wallet.controllers";

const router = Router();

router.post("/create", walletController.createWallet); // Create a new Wallet
router.post("/deposit", authMiddleware, walletController.depositFunds); // Deposit funds
router.post("/withdraw", authMiddleware, walletController.withdrawFunds); // Withdraw funds
router.post("/transfer", authMiddleware, walletController.transferFunds); // Withdraw funds
router.get("/balance", authMiddleware, walletController.getWalletBalance); // Get wallet balance
router.get("/", authMiddleware, walletController.getWallet); // Get wallet
router.delete("/delete", walletController.deleteWallet); // Delete wallet

router.get("/:walletId/transactions", authMiddleware, walletController.getWalletTransactions); // Get wallet transactions
router.get("/transaction/:transactionId", authMiddleware, walletController.getTransactionInvoice); // Get wallet transactions Invoice

export default router;
