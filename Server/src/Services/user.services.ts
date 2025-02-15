import prisma from "../config/DB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User input interface
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

// User create service
export const createUser = async ({
  username,
  email,
  name,
  password,
}: CreateUserInput) => {
  if (!username || !email || !name || !password) {
    throw new Error("All files are required");
  }

  const emailExists = await prisma.user.findUnique({
    where: { email },
  });
  if (emailExists) {
    throw new Error("User with this email already exists");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      name,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async ({ email, password }: LoginUserInput) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
