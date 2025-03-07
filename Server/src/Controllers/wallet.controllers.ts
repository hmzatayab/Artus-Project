import { Request, Response } from "express";
import prisma from "../config/DB";
import * as walletService from "../Services/wallet.services";

export const depositFunds = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!amount) {
    res.status(400).json({ success: false, message: "Amount is required" });
    return;
  }

  try {
    const wallet = await walletService.depositFunds(userId, amount);
    res.status(200).json({ success: true, wallet });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
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

  if (!senderId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!amount || !receiverId) {
    res.status(400).json({ message: "Receiver ID and amount are required" });
    return;
  }

  try {
    const result = await walletService.transferFunds(
      senderId,
      receiverId,
      amount
    );
    res.status(200).json({ success: true, result }); // ✅ Ensure return is here
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message }); // ✅ Ensure return is here
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
  try {
    const { walletId } = req.params;

    if (!walletId) {
       res.status(400).json({ success: false, error: "Wallet ID is required" });
       return
    }

    const result = await walletService.getWalletTransactions(walletId);

    if (!result.success) {
       res.status(500).json(result);
       return
    }

     res.status(200).json(result);
  } catch (error) {
    console.error("🔥 Controller Error:", error);
     res.status(500).json({ success: false, error: "Internal Server Error" });
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

export const createWallet = async (req: Request, res: Response) => {
  const { userId, balance } = req.body;

  if (!userId || balance === undefined) {
    res
      .status(400)
      .json({ success: false, message: "userId and balance are required" });
    return;
  }

  try {
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (existingWallet) {
      res.status(200).json({
        success: true,
        message: "Wallet already exists",
        wallet: existingWallet,
      });
      return;
    }

    const walletId = Math.floor(10000000 + Math.random() * 90000000).toString();

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        balance,
        walletId,
        isActive: true,
      },
    });

    res.status(201).json({ success: true, wallet });
    return;
  } catch (error: any) {
    console.error("Error creating wallet:", error);

    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }
  }
};

export const deleteWallet = async (req: Request, res: Response) => {
  const { userId, walletId } = req.body;

  if (!userId || !walletId) {
    res
      .status(400)
      .json({ success: false, message: "userId and walletId are required" });
    return;
  }

  try {
    const findWallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!findWallet || findWallet.walletId !== walletId) {
      res.status(404).json({
        success: false,
        message: "Wallet not found or incorrect walletId",
      });
      return;
    }

    await prisma.wallet.delete({
      where: { userId },
    });

    res
      .status(200)
      .json({ success: true, message: "Wallet deleted successfully" });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWallet = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(400).json({ success: false, message: "User ID is required" });
    return;
  }

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
      return;
    }

    res.status(200).json({ success: true, wallet });
  } catch (error: any) {
    // ✅ Ensure response is not sent again
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
