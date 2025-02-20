import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import { depositFunds, withdrawFunds, transferFunds, getWalletBalance, getWalletTransactions, getTransactionInvoice, createWallet, deleteWallet } from "../Controllers/wallet.controllers";

const router = Router();

router.post("/create", createWallet); // Create a new Wallet
router.post("/deposit", authMiddleware, depositFunds); // Deposit funds
router.post("/withdraw", authMiddleware, withdrawFunds); // Withdraw funds
router.post("/transfer", authMiddleware, transferFunds); // Withdraw funds
router.get("/balance", authMiddleware, getWalletBalance); // Get wallet balance
router.delete("/delete", deleteWallet); // Delete wallet

router.get("/transaction", authMiddleware, getWalletTransactions); // Get wallet transactions
router.get("/transaction/:transactionId", authMiddleware, getTransactionInvoice); // Get wallet transactions Invoice

export default router;
