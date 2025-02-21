import { Request, Response, RequestHandler } from "express";
import prisma from "../config/DB";
import * as userService from "../Services/user.services";

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

export const requestPasswordResetController = async (req: Request, res: Response) => {
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
  res.send("Profile Here");
};
