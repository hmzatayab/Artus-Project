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

  const user = await prisma.user.create({
    data: {
      username,
      email,
      name,
      password: hashedPassword,
      emailVerificationToken,
    },
  });

  const verificationLink = `http://localhost:3000/user//verify-email?token=${emailVerificationToken}`;

  // Placeholder for sending email
  console.log(`Verify your email by clicking here: ${verificationLink}`);

  return user;
};

export const loginUser = async ({ 
  email, password 
}: LoginUserInput) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
    algorithm: "HS512",
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
