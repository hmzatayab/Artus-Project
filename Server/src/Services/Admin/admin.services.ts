import prisma from "../../config/DB";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generateId } from "../../utils/generateId";

interface CreateAdminInput {
  email: string;
  name: string;
  password: string;
}

interface LoginAdminInput {
  email: string;
  password: string;
  twoFactorCode?: string;
  passcode?: string;
}

export const createAdmin = async ({
  email,
  name,
  password,
}: CreateAdminInput) => {
  if (!email || !name || !password) {
    throw new Error("All files are required");
  }

  const [emailExists] = await Promise.all([
    prisma.admin.findUnique({ where: { email } }),
  ]);

  if (emailExists) throw new Error("Email already in use");

  const adminCount = await prisma.admin.count();
  const role = adminCount === 0 ? "Admin" : "Employee";

  const hashedPassword = await bcrypt.hash(password, 12);
  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  const user = await prisma.admin.create({
    data: {
      email,
      name,
      passcode: generateId(4),
      adminId: generateId(8),
      password: hashedPassword,
      emailVerificationToken,
      walletIsActive: adminCount === 0,
      role: role,
    },
  });

  if (adminCount === 0) {
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        walletId: "70820020",
      },
    });
  }

  const verificationLink = `http://localhost:3000/admin/verify-email?token=${emailVerificationToken}`;
  console.log(`Verify your email by clicking here: ${verificationLink}`);

  setInterval(async () => {
    const newPasscode = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      const result = await prisma.admin.updateMany({
        where: { role: "Admin" },
        data: { passcode: newPasscode },
      });
        console.log(`Admin passcode updated to: ${newPasscode}`, result);
    } catch (error) {
      console.error("Failed to update admin passcodes:", error);
    }
  }, 30000);

  return user;
};

export const loginUser = async ({
  email,
  password,
  twoFactorCode,
  passcode,
}: LoginAdminInput) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new Error("Invalid credentials");
  }

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (twoFactorCode !== admin.adminId) {
    throw new Error("Admin code incorrect");
  }

  if (admin.role === "Admin" && passcode !== admin.passcode) {
    throw new Error("Invalid passcode");
  }

  const adminToken = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, {
    expiresIn: "24hr",
    algorithm: "HS512",
  });

  const { password: _, ...adminWithoutPassword } = admin;

  return { admin: adminWithoutPassword, adminToken };
};

export const requestPasswordResetService = async (
  email: string,
  passcode: string
) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw new Error("User not found");
  }
  if (admin.passcode !== passcode) {
    throw new Error("Invalid passcode");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(new Date().getTime() + 3600000);

  await prisma.admin.update({
    where: { email },
    data: {
      passwordResetToken: resetToken,
      passwordResetTokenExpiry: resetTokenExpiry,
    },
  });

  const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
  console.log(`Password reset link (to send via email): ${resetLink}`);
};

export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  const admin = await prisma.admin.findFirst({
    where: { passwordResetToken: token },
  });

  if (!admin) {
    throw new Error("Invalid or expired reset token");
  }

  const now = new Date();
  if (admin.passwordResetTokenExpiry && admin.passwordResetTokenExpiry < now) {
    throw new Error("Reset token has expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });

  throw new Error("Password updated successfully");
};
