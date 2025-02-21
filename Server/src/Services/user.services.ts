import prisma from "../config/DB";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface CreateUserInput {
  username: string;
  email: string;
  name: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export const createUser = async ({
  username,
  email,
  name,
  password,
}: CreateUserInput) => {
  if (!username || !email || !name || !password) {
    throw new Error("All files are required");
  }

  const [emailExists, usernameExists] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (emailExists) throw new Error("Email already in use");
  if (usernameExists) throw new Error("Username already taken");

  const hashedPassword = await bcrypt.hash(password, 12);
  const emailVerificationToken = crypto.randomBytes(32).toString("hex");
  const userIDGen = parseInt(crypto.randomBytes(4).toString("hex"), 16)
    .toString()
    .slice(0, 8);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      name,
      userId: userIDGen,
      password: hashedPassword,
      emailVerificationToken,
      walletIsActive: true,
    },
  });

  const walletId = Math.floor(10000000 + Math.random() * 90000000).toString();

  await prisma.wallet.create({
    data: {
      userId: user.id,
      balance: 0,
      walletId,
      isActive: true,
    },
  });

  const verificationLink = `http://localhost:3000/user//verify-email?token=${emailVerificationToken}`;
  console.log(`Verify your email by clicking here: ${verificationLink}`);

  return user;
};

export const loginUser = async ({ email, password }: LoginUserInput) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  if (!user || !user.userId) {
    throw new Error("User or userId not found");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
    algorithm: "HS512",
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const requestPasswordResetService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(new Date().getTime() + 3600000);
  
  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: resetToken,
      passwordResetTokenExpiry: resetTokenExpiry,
    },
  });

  const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
  console.log(`Password reset link (to send via email): ${resetLink}`);
};

export const resetPasswordService = async (token: string, newPassword: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token },
    });
  
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }
  
    const now = new Date();
    if (user.passwordResetTokenExpiry && user.passwordResetTokenExpiry < now) {
      throw new Error("Reset token has expired");
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 12);
  
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
