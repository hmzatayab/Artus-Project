import { Request, Response } from "express";
import { createUser, loginUser } from "../Services/user.services";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);

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
    const { user, token } = await loginUser(req.body);
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};