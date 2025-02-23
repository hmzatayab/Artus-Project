import prisma from "../config/DB";
import { Request, Response } from "express";

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    const notifications = await prisma.notification.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: { id: true, username: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
