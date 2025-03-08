import fs from "fs";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { Request, Response, RequestHandler } from "express";
import prisma from "../config/DB";
import * as userService from "../Services/user.services";
import { AppError } from "../Types/Error";
import { fileURLToPath } from "url";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      ...(user as any)._doc,
      password: null,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { user, token } = await userService.loginUser(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

export const userUpdate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    const { name, username, bio } = req.body;
    let imageURL = user?.image;

    if (req.file) {
      imageURL = `${req.protocol}://${req.get("host")}/Images/${req.file.filename}`;

      if (user?.image) {
        const oldImagePath = path.join(__dirname, "../../Public/Images", path.basename(user.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio,
        image: imageURL, 
      },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    const err = error as AppError;
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

export const emailVerify: RequestHandler = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token as string },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerificationToken: null },
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify email" });
  }
};

export const requestPasswordResetController = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    await userService.requestPasswordResetService(email);
    res.status(200).json({ message: "Password reset link sent to email" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ error: "Token and new password are required" });
    return;
  }

  try {
    await userService.resetPasswordService(token, newPassword);
    res.status(200).json({ message: "Password reset successful" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const userProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        comments: true,
        replies: true,
        auctions: true,
        highestBids: true,
        wonAuctions: true,
        receivedNotifications: true,
        sentNotifications: true,
        Bid: true,
        wallet: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const {
      password,
      passwordResetToken,
      passwordResetTokenExpiry,
      ...userData
    } = user;

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        image: true,
        followers: true,
        identityVerified: true,
        isBlocked: true,
        isEmailVerified: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const { targetUserId } = req.body;
    const userId = (req as any).user?.userId;

    if (!targetUserId) {
      res.status(400).json({ error: "Target user ID is required." });
      return;
    }

    const result = await userService.toggleFollowService(userId, targetUserId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { followers: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const followers = await prisma.user.findMany({
      where: { id: { in: user.followers } },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        followers: true,
        identityVerified: true,
      },
    });

    res.json({ followers });
  } catch (error: any) {
    res.status(500).json({ error: "Something went wrong." });
  }
};
