import { Request, Response, RequestHandler } from "express";
import prisma from "../../config/DB";
import * as adminService from "../../Services/Admin/admin.services";

export const adminRegister = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.createAdmin(req.body);

    res.status(201).json({
      message: "Admin registered successfully",
      ...(admin as any)._doc,
      password: null,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { admin, adminToken } = await adminService.loginUser(req.body);
    res.cookie("adminToken", adminToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ adminToken, admin });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const adminLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

export const emailVerify: RequestHandler = async (req, res) => {
  const { adminToken } = req.query;

  try {
    const admin = await prisma.admin.findFirst({
      where: { emailVerificationToken: adminToken as string },
    });

    if (!admin) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    await prisma.admin.update({
      where: { id: admin.id },
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
  const { email, passcode } = req.body;

  if (!email || !passcode) {
    res.status(400).json({ error: "Email and passcode are required" });
    return;
  }

  try {
    // Call service to request password reset
    await adminService.requestPasswordResetService(email, passcode);
    res.status(200).json({ message: "Password reset link sent to email" });
    return;
  } catch (error) {
    console.log(error);
    
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
    // Call service to reset the password
    await adminService.resetPasswordService(token, newPassword);
    res.status(200).json({ message: "Password reset successful" });
    return;
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
