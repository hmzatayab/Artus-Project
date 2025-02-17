import { Request, Response } from "express";
import * as walletService from "../Services/wallet.services";


export const depositFunds = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId)
    res.status(401).json({ success: false, message: "Unauthorized" });
  if (!amount)
    res.status(400).json({ success: false, message: "Amount is required" });

  try {
    const wallet = await walletService.depositFunds(userId, amount);
    res.status(200).json({ success: true, wallet });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const withdrawFunds = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId)
    res.status(401).json({ success: false, message: "Unauthorized" });
  if (!amount)
    res.status(400).json({ success: false, message: "Amount is required" });

  try {
    const wallet = await walletService.withdrawFunds(userId, amount);
    res.status(200).json({ success: true, wallet });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const transferFunds = async (req: Request, res: Response) => {
  const { receiverId, amount } = req.body;
  const senderId = (req as any).user?.userId;

  if (!senderId)
    res.status(401).json({ success: false, message: "Unauthorized" });
  if (!receiverId || !amount) {
    res
      .status(400)
      .json({ success: false, message: "Receiver ID and amount are required" });
  }

  try {
    const result = await walletService.transferFunds(
      senderId,
      receiverId,
      amount
    );
    res.status(200).json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWalletBalance = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  if (!userId)
    res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const balance = await walletService.getWalletBalance(userId);
    res.status(200).json({ success: true, balance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWalletTransactions = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  if (!userId)
    res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const transactions = await walletService.getWalletTransactions(userId);
    res.status(200).json({ success: true, transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionInvoice = async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    res
      .status(400)
      .json({ success: false, message: "Transaction ID is required" });
  }

  try {
    const transaction = await walletService.getTransactionInvoice(
      transactionId
    );
    res.status(200).json({ success: true, transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
