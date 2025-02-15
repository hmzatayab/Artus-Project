import express from "express";

import { locationMiddleware } from '../Middleware/locationMiddleware';
import { authMiddleware } from '../Middleware/authMiddleware';
import { userRegister, userLogin, userLogout, userProfile, emailVerify } from "../Controllers/user.controllers";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", locationMiddleware, userLogin);
router.post("/logout", authMiddleware, userLogout);
router.get("/verify-email", emailVerify);
router.get("/profile", authMiddleware, userProfile);

export default router;
